import { S3, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId ?? '',
    secretAccessKey: process.env.secretAccessKey ?? ''
  }
});

export const uploadFile = async (fileBuffer: any, fileOriginalName: string, mimeType: string) => {
  const params: PutObjectCommand = new PutObjectCommand({
    Bucket: process.env.bucket ?? '',
    Key: `${fileOriginalName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ContentDisposition: 'inline'
  });

  try {
    const response = await s3.send(params);
    return response;
  } catch (error: any) {
    return error.message;
  };
};

export const deleteFile = async (imgS3Key: string) => {
  const params: DeleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.bucket,
    Key: imgS3Key
  });

  try {
    const response = await s3.send(params);
    return response;
  } catch (error: any) {
    return error.message;
  };
};

export const findFile = async (imgS3Key: string) => {
  const params: GetObjectCommand = new GetObjectCommand({
    Bucket: process.env.bucket,
    Key: imgS3Key
  });

  try {
    const response = await s3.send(params);
    return response;
  } catch (error: any) {
    return error.message;
  };
}