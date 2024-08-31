import * as cdk from 'aws-cdk-lib';
import { aws_s3, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloAwsCdkv2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = this.initializeSiffix();

    const bucket = new aws_s3.Bucket(this, 'TsBucket', {
      bucketName: `cool-bucket-${suffix}`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(3)
        }
      ]
    });

    console.log('bucket name: ' + bucket.bucketName)
  }

  // Fn は AWS CloudFormation の組み込み関数を提供するクラスのこと。
  // 1. this.stackId を '/' で分割し、その結果のリストの3番目の要素（インデックス2）を取得。これが shortStackId のこと。
  // 2. shortStackId を '-' で分割し、その結果のリストの5番目の要素（インデックス4）を取得。これが suffix のこと
  // これをsuffix にすることでどのcloud formation から実行されたのかがわかる。
  private initializeSiffix(){
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId))
    const suffix = Fn.select(4, Fn.split('-', shortStackId))

    return suffix;
  }
}
