import * as cdk from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface TsHandlerStackProps extends cdk.StackProps {
  coolBucket: cdk.aws_s3.Bucket;
}

export class TsHandlerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TsHandlerStackProps) {
    super(scope, id, props);

    new LambdaFunction(this, 'CoolHandler', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromInline(`
      exports.handler = async (event) => {
        console.log("env bucket: " + process.env.COOL_BUCKET_ARN)
      };
    `),
      environment: {
          COOL_BUCKET_ARN: props.coolBucket.bucketArn,
      },
    });
  }
}
