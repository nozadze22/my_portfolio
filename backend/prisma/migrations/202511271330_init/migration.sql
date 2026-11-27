-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "public"."SkillCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'DATABASE', 'TOOL', 'PLATFORM', 'OTHER');

-- CreateTable
CREATE TABLE "public"."site_profile" (
    "id" TEXT NOT NULL DEFAULT 'owner',
    "fullName" TEXT NOT NULL,
    "shortLabel" TEXT,
    "roleTitle" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "aboutBody" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "avatarUrl" TEXT,
    "availability" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isReplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "role" TEXT,
    "year" INTEGER,
    "imageUrl" TEXT,
    "repoUrl" TEXT,
    "demoUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "employmentType" "public"."EmploymentType",
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "public"."SkillCategory" NOT NULL DEFAULT 'OTHER',
    "iconUrl" TEXT,
    "color" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."educations" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT,
    "fieldOfStudy" TEXT,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProjectToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ExperienceToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ExperienceToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EducationToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EducationToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "contact_messages_isRead_idx" ON "public"."contact_messages"("isRead");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "public"."contact_messages"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "public"."skills"("slug");

-- CreateIndex
CREATE INDEX "skills_category_sortOrder_idx" ON "public"."skills"("category", "sortOrder");

-- CreateIndex
CREATE INDEX "skills_published_idx" ON "public"."skills"("published");

-- CreateIndex
CREATE INDEX "educations_published_sortOrder_idx" ON "public"."educations"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "_ProjectToSkill_B_index" ON "public"."_ProjectToSkill"("B");

-- CreateIndex
CREATE INDEX "_ExperienceToProject_B_index" ON "public"."_ExperienceToProject"("B");

-- CreateIndex
CREATE INDEX "_ExperienceToSkill_B_index" ON "public"."_ExperienceToSkill"("B");

-- CreateIndex
CREATE INDEX "_EducationToSkill_B_index" ON "public"."_EducationToSkill"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToProject" ADD CONSTRAINT "_ExperienceToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToProject" ADD CONSTRAINT "_ExperienceToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToSkill" ADD CONSTRAINT "_ExperienceToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToSkill" ADD CONSTRAINT "_ExperienceToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EducationToSkill" ADD CONSTRAINT "_EducationToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."educations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EducationToSkill" ADD CONSTRAINT "_EducationToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
