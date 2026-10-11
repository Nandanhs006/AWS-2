#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MausamDhaalStack } from '../lib/mausam-dhaal-stack';

const app = new cdk.App();

new MausamDhaalStack(app, 'MausamDhaalStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
    region: process.env.CDK_DEFAULT_REGION || 'ap-south-1',
  },
  description: 'Mausam Dhaal — Parametric Heat-Cover Workbench Infrastructure Stack',
});
