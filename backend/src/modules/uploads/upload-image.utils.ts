import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import path from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function assertValidImageFile(file: Express.Multer.File) {
  if (!ALLOWED.has(file.mimetype)) {
    throw new BadRequestException(`Unsupported image type: ${file.mimetype}`);
  }
  if (file.size > MAX_BYTES) {
    throw new BadRequestException("Image exceeds 5MB");
  }
}

export function imageObjectKey(file: Express.Multer.File) {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const safeExt = /^\.(jpe?g|png|webp|gif|avif)$/i.test(ext) ? ext : ".jpg";
  return `${randomUUID()}${safeExt}`;
}