import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

class S3Service {
    constructor() {
        const bucketName = process.env.BUCKET_NAME;
        const bucketRegion = process.env.BUCKET_REGION;
        const accessKeyId = process.env.ACCESS_KEY;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

        if (!bucketName || !bucketRegion || !accessKeyId || !secretAccessKey) {
            throw new Error("Missing required environment variables for AWS S3.");
        }

        this.bucketName = bucketName;

        this.s3 = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region: bucketRegion,
        });
    }

    async uploadFile(folderPath, file) {
        const uniqueName = crypto.randomBytes(16).toString('hex') + '-' + file.originalname;
        const params = {
            Bucket: this.bucketName,
            Key: `${folderPath}${uniqueName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            const command = new PutObjectCommand(params);
            const data = await this.s3.send(command);
            console.log(`File uploaded successfully.`);
            return uniqueName;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    async getFile(fileName, folder) {
        try {
            const options = {
                Bucket: this.bucketName,
                Key: `${folder}/${fileName}`,
            };
            const getCommand = new GetObjectCommand(options);
            const url = await getSignedUrl(this.s3, getCommand, { expiresIn: 60 * 60 });
            return url;
        } catch (error) {
            console.error("Error generating signed URL:", error);
            throw error;
        }
    }

    async deleteFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            const command = new DeleteObjectCommand(params);
            const data = await this.s3.send(command);
            console.log(`File deleted successfully from ${key}`);
            return data;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
}

export default S3Service;
