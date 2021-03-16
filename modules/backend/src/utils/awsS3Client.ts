import aws from "aws-sdk";
import fileUpload from "express-fileupload";
import { v4 as generateId } from "uuid";
import { UploadImageSuccessResult } from "../types/RestApiResponses";

const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;

class AwsS3Client {
  s3Client: aws.S3;

  constructor() {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.s3Client = new aws.S3();
  }

  public async uploadImage(
    photo: fileUpload.UploadedFile
  ): Promise<UploadImageSuccessResult> {
    if (S3_BUCKET) {
      const fileName = `${generateId()}-${photo.name}`;
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `${process.env.AWS_S3_MARKING_IMAGE_FOLDER}/${fileName}`,
        Body: photo.data,
      };
      const result = await this.s3Client.upload(s3Params).promise();
      return { url: result.Location, fileName };
    }
    throw new Error(
      "No S3_BUCKET env variable found, defined this to access S3"
    );
  }

  public async deleteImage(fileNameOrUrl: string): Promise<boolean> {
    const fileName = AwsS3Client.extractFileNameFromUrl(fileNameOrUrl);
    if (S3_BUCKET) {
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `${process.env.AWS_S3_MARKING_IMAGE_FOLDER}/${fileName}`,
      };
      await this.s3Client.deleteObject(s3Params).promise();
      return true;
    }
    throw new Error(
      "No S3_BUCKET env variable found, defined this to access S3"
    );
  }

  public static extractFileNameFromUrl(fileUrl: string): string {
    const splitted = fileUrl.split("/");
    if (splitted.length > 0) return splitted[splitted.length - 1];
    return fileUrl;
  }
}

export default new AwsS3Client();
