import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";

import { r2Endpoint, readR2Config, type R2Config } from "./r2-env.js";

export type UploadScope = "projects" | "profile" | "misc";

@Injectable()
export class R2StorageService implements OnModuleInit {
  private readonly log = new Logger(R2StorageService.name);
  private client: S3Client | null = null;
  private config: R2Config | null = null;

  onModuleInit() {
    const config = readR2Config();
    if (!config) {
      this.log.warn("R2 credentials or bucket missing — uploads will use local disk fallback.");
      return;
    }

    if (!config.publicBaseUrl) {
      this.log.warn(
        "R2_PUBLIC_BASE_URL is not set — R2 uploads will fail until a public bucket URL or custom domain is configured.",
      );
    }

    this.config = config;
    this.client = new S3Client({
      region: "auto",
      endpoint: r2Endpoint(config.accountId),
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    this.log.log(`R2 storage ready (bucket: ${config.bucket}).`);
  }

  isEnabled() {
    return this.client !== null && this.config !== null;
  }

  hasPublicUrl() {
    return Boolean(this.config?.publicBaseUrl);
  }

  async putImage(scope: UploadScope, key: string, body: Buffer, contentType: string) {
    if (!this.client || !this.config) {
      throw new InternalServerErrorException("R2 storage is not configured");
    }
    if (!this.config.publicBaseUrl) {
      throw new InternalServerErrorException(
        "R2_PUBLIC_BASE_URL is missing in environment variables",
      );
    }

    const objectKey = `${scope}/${key}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return `${this.config.publicBaseUrl}/${objectKey}`;
  }

  async deleteByUrl(publicUrl: string) {
    if (!this.client || !this.config?.publicBaseUrl) {
      return;
    }

    const prefix = `${this.config.publicBaseUrl}/`;
    if (!publicUrl.startsWith(prefix)) {
      return;
    }

    const key = publicUrl.slice(prefix.length);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }
}