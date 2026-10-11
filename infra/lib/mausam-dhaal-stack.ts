import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as path from 'path';

export class MausamDhaalStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------------
    // 1. S3 Evidence & Tamper-Evident Ledger Bucket (Object Lock)
    // -------------------------------------------------------------
    const evidenceBucket = new s3.Bucket(this, 'EvidenceBucket', {
      bucketName: `heatsutra-evidence-${this.account}-${this.region}`,
      versioned: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(1)),
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------------
    // 2. DynamoDB Decisions Ledger Table
    // -------------------------------------------------------------
    const decisionsTable = new dynamodb.Table(this, 'DecisionsTable', {
      tableName: 'HeatSutraDecisions',
      partitionKey: { name: 'decision_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------------
    // 3. SQS Queue + Dead-Letter Queue (DLQ) for Payout Fan-Out
    // -------------------------------------------------------------
    const deadLetterQueue = new sqs.Queue(this, 'DisbursementDLQ', {
      queueName: 'HeatSutraDisbursementDLQ',
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    const disbursementQueue = new sqs.Queue(this, 'DisbursementQueue', {
      queueName: 'HeatSutraDisbursementQueue',
      visibilityTimeout: cdk.Duration.seconds(300),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: deadLetterQueue,
      },
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    // -------------------------------------------------------------
    // 4. Lambda Functions with Least-Privilege IAM Roles
    // -------------------------------------------------------------
    const backendPath = path.join(__dirname, '../../backend');

    // (A) Re-Pricing & Budget Solver Lambda (API Gateway Integration)
    const repriceFn = new lambda.Function(this, 'RepriceHandler', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handlers.reprice_handler.handler',
      code: lambda.Code.fromAsset(backendPath),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        REGION: this.region,
      },
    });

    // (B) Daily Evaluation & Forecast Audit Lambda (EventBridge)
    const dailyEvalFn = new lambda.Function(this, 'DailyEvaluationHandler', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handlers.daily_evaluation_handler.handler',
      code: lambda.Code.fromAsset(backendPath),
      memorySize: 512,
      timeout: cdk.Duration.seconds(60),
      environment: {
        DECISIONS_TABLE_NAME: decisionsTable.tableName,
        EVIDENCE_BUCKET_NAME: evidenceBucket.bucketName,
        DISBURSEMENT_QUEUE_URL: disbursementQueue.queueUrl,
      },
    });

    // Least-privilege IAM grants
    decisionsTable.grantWriteData(dailyEvalFn);
    evidenceBucket.grantWrite(dailyEvalFn);
    disbursementQueue.grantSendMessages(dailyEvalFn);

    // (C) SQS Fan-Out & SES Notification Consumer
    const fanoutFn = new lambda.Function(this, 'FanoutHandler', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handlers.fanout_handler.handler',
      code: lambda.Code.fromAsset(backendPath),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        SES_SENDER_EMAIL: 'advisory@heatsutra.org',
      },
    });

    disbursementQueue.grantConsumeMessages(fanoutFn);
    fanoutFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    // -------------------------------------------------------------
    // 5. API Gateway HTTP API
    // -------------------------------------------------------------
    const httpApi = new apigwv2.HttpApi(this, 'HeatSutraApi', {
      apiName: 'HeatSutraServiceApi',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type'],
      },
    });

    const repriceIntegration = new apigwv2_integrations.HttpLambdaIntegration(
      'RepriceIntegration',
      repriceFn
    );

    httpApi.addRoutes({
      path: '/api/reprice',
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: repriceIntegration,
    });

    // -------------------------------------------------------------
    // 6. EventBridge Daily Forecast Evaluation Schedule (06:00 IST / 00:30 UTC)
    // -------------------------------------------------------------
    const dailyRule = new events.Rule(this, 'DailyHeatEvaluationRule', {
      ruleName: 'HeatSutraDailyEvaluation',
      description: 'Daily morning forecast heat evaluation for registered worker cohorts',
      schedule: events.Schedule.cron({ minute: '30', hour: '0' }), // 00:30 UTC = 06:00 IST
    });
    dailyRule.addTarget(new targets.LambdaFunction(dailyEvalFn));

    // -------------------------------------------------------------
    // 7. S3 + CloudFront Static Web Hosting for Frontend
    // -------------------------------------------------------------
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `heatsutra-site-${this.account}-${this.region}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Deploy built frontend to S3
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    new s3deploy.BucketDeployment(this, 'DeployWorkbenchSite', {
      sources: [s3deploy.Source.asset(frontendDistPath)],
      distribution,
      destinationBucket: siteBucket,
      distributionPaths: ['/*'],
    });

    // -------------------------------------------------------------
    // 8. CloudWatch Alarms & Operational Dashboard
    // -------------------------------------------------------------
    const evalErrorAlarm = new cloudwatch.Alarm(this, 'EvaluationErrorsAlarm', {
      alarmName: 'HeatSutra-Evaluation-Errors',
      metric: dailyEvalFn.metricErrors({ period: cdk.Duration.minutes(5) }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    const dlqAlarm = new cloudwatch.Alarm(this, 'DisbursementDLQAlarm', {
      alarmName: 'HeatSutra-DLQ-Messages',
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible({
        period: cdk.Duration.minutes(5),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    const dashboard = new cloudwatch.Dashboard(this, 'HeatSutraOperationalDashboard', {
      dashboardName: 'HeatSutra-Operational-Metrics',
      widgets: [
        [
          new cloudwatch.GraphWidget({
            title: 'Daily Heat Evaluation Invocations and Errors',
            left: [dailyEvalFn.metricInvocations()],
            right: [dailyEvalFn.metricErrors()],
            width: 12,
          }),
          new cloudwatch.GraphWidget({
            title: 'Reprice API Latency (ms)',
            left: [repriceFn.metricDuration()],
            width: 12,
          }),
        ],
        [
          new cloudwatch.GraphWidget({
            title: 'Disbursement SQS Visible Messages and DLQ',
            left: [disbursementQueue.metricApproximateNumberOfMessagesVisible()],
            right: [deadLetterQueue.metricApproximateNumberOfMessagesVisible()],
            width: 24,
          }),
        ],
      ],
    });

    // -------------------------------------------------------------
    // 9. AWS Budgets Alarm at $5.00
    // -------------------------------------------------------------
    new budgets.CfnBudget(this, 'CostBudgetAlarm', {
      budget: {
        budgetName: 'HeatSutra-Monthly-Budget',
        budgetLimit: {
          amount: 5,
          unit: 'USD',
        },
        timeUnit: 'MONTHLY',
        budgetType: 'COST',
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 80, // Alert at $4.00 (80% of $5.00)
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [
            {
              subscriptionType: 'EMAIL',
              address: 'engineering@heatsutra.org',
            },
          ],
        },
      ],
    });

    // -------------------------------------------------------------
    // Stack Outputs
    // -------------------------------------------------------------
    new cdk.CfnOutput(this, 'CloudFrontDistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront URL for HeatSutra static workbench site',
    });

    new cdk.CfnOutput(this, 'ApiGatewayEndpointUrl', {
      value: httpApi.url || '',
      description: 'HTTP API Gateway URL for dynamic re-pricing Lambda',
    });

    new cdk.CfnOutput(this, 'DecisionsTableName', {
      value: decisionsTable.tableName,
      description: 'DynamoDB table storing tamper-evident decisions',
    });

    new cdk.CfnOutput(this, 'EvidenceBucketArn', {
      value: evidenceBucket.bucketArn,
      description: 'S3 bucket with Object Lock for governance-mode decision proof bundles',
    });
  }
}
