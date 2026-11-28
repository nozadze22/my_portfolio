-- Project.galleryUrls added in schema after init; required for list/create APIs.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "galleryUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];