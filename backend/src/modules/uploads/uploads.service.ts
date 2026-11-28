import { BadRequestException, Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertValidImageFile,
  imageObjectKey,
} from "./upload-image.utils.js";
import { R2StorageService, type UploadScope } from "./r2-storage.service.js";

@Injectable()
export class UploadsService {
  private readonly localDir = path.join(process.cwd(), "uploads");

  constructor(private readonly r2: R2StorageService) {}

  async saveImages(files: Express.Multer.File[], scope: UploadScope = "projects") {
    if (!files.length) {
      throw new BadRequestException("No files provided");
    }

    const urls: string[] = [];

    for (const file of files) {
      assertValidImageFile(file);
      const key = imageObjectKey(file);

      if (this.r2.isEnabled() && this.r2.hasPublicUrl()) {
        const url = await this.r2.putImage(scope, key, file.buffer, file.mimetype);
        urls.push(url);
        continue;
      }

      const url = await this.saveLocal(scope, key, file.buffer);
      urls.push(url);
    }

    return { urls, storage: this.r2.isEnabled() && this.r2.hasPublicUrl() ? "r2" : "local" };
  }

  /** @deprecated use saveImages(..., "projects") */
  async saveProjectImages(files: Express.Multer.File[]) {
    return this.saveImages(files, "projects");
  }

  private async saveLocal(scope: UploadScope, filename: string, body: Buffer) {
    const dir = path.join(this.localDir, scope);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), body);

    const basePublic =
      process.env.PUBLIC_API_URL?.replace(/\/$/, "") ??
      `http://localhost:${process.env.PORT ?? 3001}`;

    return `${basePublic}/uploads/${scope}/${filename}`;
  }
}