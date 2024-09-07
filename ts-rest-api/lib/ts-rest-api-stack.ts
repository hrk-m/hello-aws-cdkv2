import * as cdk from 'aws-cdk-lib';
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class TsRestApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TableV2: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb.TableV2.html
    const employeesTable = new TableV2(this, 'TS-EmplTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billing: Billing.onDemand()
    });

    // NodejsFunction: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html
    // NodejsFunction は aws-cdk-lib/aws-lambda-nodejs モジュールから提供され、Node.js の特定の設定や最適化を簡単に行うためのラッパーです。例えば、TypeScript のトランスパイルや、Node.js の依存関係のバンドルを自動的に行います。
    // new lambda.Function はより汎用的な Lambda 関数の定義方法で、Node.js に限らず、他のランタイム（Python、Javaなど）でも使用できます。
    const emplLambda = new NodejsFunction(this, 'Ts-EmplLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '..', 'services', 'handler.ts')),
      environment: {
        // lambda 側で、process.env.TABLE_NAME,として呼ぶために設定
        TABLE_NAME: employeesTable.tableName
      },
    })

    employeesTable.grantReadWriteData(emplLambda);

    // RestApi: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApi.html
    const api = new RestApi(this, 'TS-EmplApi');

    // CORS 設定。全てのオリジンを許可
    const optionsWithCors: ResourceOptions = {
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
            allowHeaders: ['Content-Type'],
        }
    }
    // root エンドポイントの設定
    const emplResource = api.root.addResource('empl', optionsWithCors);

    const emplLambdaIntegration = new LambdaIntegration(emplLambda);

    emplResource.addMethod('GET', emplLambdaIntegration);
    emplResource.addMethod('POST', emplLambdaIntegration);
  }
}
