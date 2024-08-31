#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { HelloAwsCdkv2Stack } from '../lib/hello-aws-cdkv2-stack';
import { TsHandlerStack } from '../lib/ts-handler-stack';

const app = new cdk.App();
const helloAwsCdkv2Stack =  new HelloAwsCdkv2Stack(app, 'HelloAwsCdkv2Stack', {
  env: { region: 'ap-northeast-1' },
});

new TsHandlerStack(app, 'TsHandlerStack', {
  coolBucket: helloAwsCdkv2Stack.coolBucket,
  env: { region: 'ap-northeast-1' },
})
