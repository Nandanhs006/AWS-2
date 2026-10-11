#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HeatSutraStack } from '../lib/heatsutra-stack';

const app = new cdk.App();

new HeatSutraStack(app, 'HeatSutraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
    region: process.env.CDK_DEFAULT_REGION || 'ap-south-1',
  },
  description: 'HeatSutra — Parametric Heat-Cover Workbench Infrastructure Stack',
});
