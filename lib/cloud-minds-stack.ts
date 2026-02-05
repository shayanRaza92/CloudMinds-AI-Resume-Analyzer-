import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwInt from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class CloudMindsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🌐 Storage Layer (S3)
    const documentsBucket = new s3.Bucket(this, 'CloudMindsDocuments', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // 🚪 API Gateway (HTTP API)
    const api = new cdk.aws_apigatewayv2.HttpApi(this, 'CloudMindsAPI', {
      corsPreflight: {
        allowMethods: [cdk.aws_apigatewayv2.CorsHttpMethod.POST, cdk.aws_apigatewayv2.CorsHttpMethod.GET],
        allowOrigins: ['*'],
        allowHeaders: ['*'],
      },
    });

    // 🏗️ Resume Analyzer Function
    const analyzeFunction = new lambda.Function(this, 'AnalyzeFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('functions/analyze'),
      timeout: cdk.Duration.seconds(30),
      environment: {
        GROQ_API_KEY: 'YOUR_GROQ_API_KEY' // Replace with your actual key in a secure environment variable
      },
    });

    documentsBucket.grantRead(analyzeFunction);

    api.addRoutes({
      path: '/analyze',
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('AnalyzeIntegration', analyzeFunction),
    });

    // 📤 File Upload Function (Presigned URLs)
    const uploadFunction = new lambda.Function(this, 'UploadFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('functions/upload'),
      environment: {
        BUCKET_NAME: documentsBucket.bucketName,
      },
    });

    documentsBucket.grantPut(uploadFunction);
    documentsBucket.grantWrite(uploadFunction);

    api.addRoutes({
      path: '/upload',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET],
      integration: new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('UploadIntegration', uploadFunction),
    });

    // 🖥️ Production Frontend (S3 + CloudFront)
    const siteBucket = new s3.Bucket(this, 'CloudMindsSite', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const oai = new cdk.aws_cloudfront.OriginAccessIdentity(this, 'OAI');
    siteBucket.grantRead(oai);

    const distribution = new cdk.aws_cloudfront.Distribution(this, 'CloudMindsDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(siteBucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ]
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployFrontend', {
      sources: [cdk.aws_s3_deployment.Source.asset('./frontend/dist')],
      destinationBucket: siteBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url ?? 'Error' });
    new cdk.CfnOutput(this, 'SiteURL', { value: distribution.distributionDomainName });
  }
}
