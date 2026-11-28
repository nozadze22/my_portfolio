import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { normalizeMediaUrl } from "../../common/normalize-media-url.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

const OWNER_ID = "owner";

const DEFAULT_PROFILE = {
  id: OWNER_ID,
  fullName: process.env.SITE_OWNER_NAME ?? "Giorgi",
  shortLabel: process.env.SITE_OWNER_SHORT ?? "G.",
  roleTitle: process.env.SITE_OWNER_ROLE ?? "Full Stack Developer",
  heroTitle:
    process.env.SITE_HERO_TITLE ??
    "Building digital experiences that make an impact.",
  heroSubtitle:
    process.env.SITE_HERO_SUBTITLE ??
    "Personal portfolio — projects, experience, and contact in one place.",
  aboutBody:
    process.env.SITE_ABOUT ??
    "Update this text via admin or PATCH /profile when your API is running.",
  email: process.env.SITE_OWNER_EMAIL ?? "hello@example.com",
  phone: process.env.SITE_OWNER_PHONE ?? null,
  location: process.env.SITE_OWNER_LOCATION ?? null,
  avatarUrl: null,
  availability:
    process.env.SITE_AVAILABILITY ?? "Available for select opportunities",
  githubUrl: process.env.SITE_GITHUB_URL ?? null,
  linkedinUrl: process.env.SITE_LINKEDIN_URL ?? null,
  twitterUrl: process.env.SITE_TWITTER_URL ?? null,
  websiteUrl: process.env.SITE_WEBSITE_URL ?? null,
};

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const profile = await this.prisma.siteProfile.findUnique({
      where: { id: OWNER_ID },
    });

    if (profile) {
      return profile;
    }

    return this.prisma.siteProfile.create({
      data: DEFAULT_PROFILE,
    });
  }

  async update(data: UpdateProfileDto) {
    await this.get();

    const avatarUrl =
      data.avatarUrl !== undefined ? normalizeMediaUrl(data.avatarUrl) : undefined;

    return this.prisma.siteProfile.update({
      where: { id: OWNER_ID },
      data: {
        ...data,
        ...(data.avatarUrl !== undefined ? { avatarUrl } : {}),
      },
    });
  }
}