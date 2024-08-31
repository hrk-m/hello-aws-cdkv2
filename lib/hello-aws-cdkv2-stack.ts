import * as cdk from 'aws-cdk-lib';
import { aws_s3, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloAwsCdkv2Stack extends cdk.Stack {
  public coolBucket: aws_s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = this.initializeSuffix();

    this.coolBucket = new aws_s3.Bucket(this, 'TsBucket', {
      bucketName: `cool-bucket-${suffix}`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(3)
        }
      ]
    });

    new cdk.CfnOutput(this,
      'HelloAwsCdkv2Stack', {
        value: this.coolBucket.bucketName
      }
    )
  }

  // Fn は AWS CloudFormation の組み込み関数を提供するクラスのこと。
  // 1. this.stackId を '/' で分割し、その結果のリストの3番目の要素（インデックス2）を取得。これが shortStackId のこと。
  // 2. shortStackId を '-' で分割し、その結果のリストの5番目の要素（インデックス4）を取得。これが suffix のこと
  // これをsuffix にすることでどのcloud formation から実行されたのかがわかる。
  private initializeSuffix(){
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId))
    const suffix = Fn.select(4, Fn.split('-', shortStackId))

    return suffix;
  }
}
