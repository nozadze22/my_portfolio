import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.siteProfile.upsert({
  where: { id: "owner" },
  create: {
    id: "owner",
    fullName: process.env.SITE_OWNER_NAME ?? "Giorgi",
    shortLabel: process.env.SITE_OWNER_SHORT ?? "G.",
    roleTitle: process.env.SITE_OWNER_ROLE ?? "Full Stack Developer",
    heroTitle: "Building digital experiences that make an impact.",
    heroSubtitle: "React, Next.js, NestJS, TypeScript — ჩემი პირადი პორტფოლიო.",
    aboutBody:
      "აქ დაამატე შენი სიტყვები — Profile API ან PATCH /profile admin key-ით.",
    email: process.env.SITE_OWNER_EMAIL ?? "hello@example.com",
    availability: "Available for select opportunities",
  },
  update: {},
});

await prisma.$disconnect();