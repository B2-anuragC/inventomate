import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class ProductDocumentService {
  constructor(private readonly configService: ConfigService) {}

  BUCKET_NAME: string = this.configService.getOrThrow('aws_config.bucket_name');
  s3Instance: any = new AWS.S3({
    region: this.configService.getOrThrow('aws_config.region'),
    accessKeyId: this.configService.getOrThrow('aws_config.access_key'),
    secretAccessKey: this.configService.getOrThrow('aws_config.secret_key'),
  });

  async uploadDoc(file: any) {
    console.log(file);
    const { originalname } = file;

    const params = {
      Bucket: this.BUCKET_NAME,
      Key: originalname,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    return await this.s3Instance.upload(params).promise();
  }

  async removeDoc(key: string) {
    const params = {
      Key: key,
      Bucket: this.BUCKET_NAME,
    };
    const s3RemoveObj = await this.s3Instance.deleteObject(params).promise();
    return s3RemoveObj;
  }
}
