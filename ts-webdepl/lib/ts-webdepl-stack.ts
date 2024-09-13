import * as cdk from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';

export class TsWebdeplStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentBucket = new Bucket(this, 'TsWebDeploymentBucket')

    const uiDir = join(__dirname, '..','..', 'web', 'dist');
    if (!existsSync(uiDir)) {
      console.warn('Ui dir not found: ' + uiDir);
      return;
    }

    // OriginAccessIdentity: S3に直接アクセスされることなくcloudfrontのみからの参照に絞ることを設定することが可能。
    // https://tech-blog.s-yoshiki.com/entry/269#google_vignette
    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');

    deploymentBucket.grantRead(originIdentity);

    // Distribution: コンテンツを配信する場所と、コンテンツ配信を追跡および管理する方法の詳細を CloudFront に伝えること
    // https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
    const distribution = new Distribution(this, 'WebDeploymentDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity
        }),
      },
    });

    new BucketDeployment(this, 'WebDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
      distribution: distribution
    });

    new cdk.CfnOutput(this, 'TsAppUrl', {
      value: distribution.distributionDomainName
    })
  }
}
