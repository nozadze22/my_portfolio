/**
 * One-time: upload files from backend/uploads/ to R2 and rewrite DB URLs to R2_PUBLIC_BASE_URL.
 *
 * Usage (from backend/): pnpm migrate:media
 */
import "dotenv/config";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
function guessMime(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");
const uploadsRoot = path.join(backendRoot, "uploads");

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secret = process.env.R2_ACCESS_KEY_SECRET;
const bucket = process.env.R2_BUCKET ?? process.env.R2_bucket;
const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim()
  .replace(/^["']|["']$/g, "")
  .replace(/\/$/, "");

if (!accountId || !accessKeyId || !secret || !bucket || !publicBase) {
  console.error("Missing R2_* env vars or R2_PUBLIC_BASE_URL. See .env.example.");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey: secret },
});

const prisma = new PrismaClient();

const LOCAL_PATH = /^(?:https?:\/\/[^/]+)?\/uploads\/(projects|profile|misc)\/([^?#]+)$/i;

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureOnR2(scope, filename, localPath) {
  const key = `${scope}/${filename}`;
  const body = await readFile(localPath);
  const contentType = guessMime(filename);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicBase}/${key}`;
}

async function migrateUrl(oldUrl) {
  if (!oldUrl || oldUrl.startsWith(publicBase)) return oldUrl;

  const match = String(oldUrl).trim().match(LOCAL_PATH);
  if (!match) return oldUrl;

  const [, scope, filename] = match;
  const localPath = path.join(uploadsRoot, scope, filename);
  if (!(await fileExists(localPath))) {
    console.warn(`  skip (file missing): ${localPath}`);
    return oldUrl;
  }

  const next = await ensureOnR2(scope, filename, localPath);
  console.log(`  ${oldUrl} → ${next}`);
  return next;
}

async function migrateProject(project) {
  let changed = false;
  let imageUrl = project.imageUrl;
  let galleryUrls = [...(project.galleryUrls ?? [])];

  const newGallery = [];
  for (const url of galleryUrls) {
    const next = await migrateUrl(url);
    if (next !== url) changed = true;
    newGallery.push(next);
  }
  galleryUrls = newGallery;

  if (imageUrl) {
    const next = await migrateUrl(imageUrl);
    if (next !== imageUrl) changed = true;
    imageUrl = next;
  }

  imageUrl = imageUrl ?? galleryUrls[0] ?? null;

  if (changed) {
    await prisma.project.update({
      where: { id: project.id },
      data: { imageUrl, galleryUrls },
    });
    console.log(`Updated project ${project.slug}`);
  }
}

async function migrateProfile(profile) {
  if (!profile.avatarUrl) return;
  const next = await migrateUrl(profile.avatarUrl);
  if (next === profile.avatarUrl) return;
  await prisma.siteProfile.update({
    where: { id: profile.id },
    data: { avatarUrl: next },
  });
  console.log("Updated site profile avatarUrl");
}

async function main() {
  const projects = await prisma.project.findMany();
  console.log(`Projects: ${projects.length}`);
  for (const project of projects) {
    await migrateProject(project);
  }

  const profile = await prisma.siteProfile.findFirst();
  if (profile) await migrateProfile(profile);

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());