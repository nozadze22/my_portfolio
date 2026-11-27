import type { Skill } from "../schema/skill.schema";

/** URL-safe slug from display name (matches backend slugify). */
export function slugifySkillName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEVICON_ALIASES: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  "c#": "csharp",
  csharp: "csharp",
  "c++": "cplusplus",
  cpp: "cplusplus",
  node: "nodejs",
  nodejs: "nodejs",
  "node.js": "nodejs",
  react: "react",
  reactjs: "react",
  reactnative: "reactnative",
  vue: "vuejs",
  vuejs: "vuejs",
  nuxt: "nuxtjs",
  nuxtjs: "nuxtjs",
  next: "nextjs",
  nextjs: "nextjs",
  nest: "nestjs",
  nestjs: "nestjs",
  express: "express",
  fastapi: "fastapi",
  django: "django",
  flask: "flask",
  python: "python",
  java: "java",
  kotlin: "kotlin",
  golang: "go",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  dart: "dart",
  flutter: "flutter",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  aws: "amazonwebservices",
  azure: "azure",
  gcp: "googlecloud",
  postgres: "postgresql",
  postgresql: "postgresql",
  mysql: "mysql",
  mongo: "mongodb",
  mongodb: "mongodb",
  redis: "redis",
  prisma: "prisma",
  graphql: "graphql",
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",
  sass: "sass",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  bootstrap: "bootstrap",
  figma: "figma",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  linux: "linux",
  bash: "bash",
  nginx: "nginx",
  vite: "vite",
  webpack: "webpack",
  jest: "jest",
  cypress: "cypress",
  supabase: "supabase",
  firebase: "firebase",
};

function resolveDeviconKey(name: string): string {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return "";

  if (DEVICON_ALIASES[trimmed]) return DEVICON_ALIASES[trimmed];

  const compact = trimmed.replace(/\s+/g, "");
  if (DEVICON_ALIASES[compact]) return DEVICON_ALIASES[compact];

  const slug = slugifySkillName(name);
  if (DEVICON_ALIASES[slug]) return DEVICON_ALIASES[slug];
  const slugCompact = slug.replace(/-/g, "");
  if (DEVICON_ALIASES[slugCompact]) return DEVICON_ALIASES[slugCompact];

  return slug.replace(/-/g, "") || slug;
}

/** Devicon CDN URL guessed from skill name (may 404 for unknown stacks). */
export function resolveSkillIconUrl(name: string): string | undefined {
  const key = resolveDeviconKey(name);
  if (!key) return undefined;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${key}/${key}-original.svg`;
}

export function nextSkillSortOrder(skills: Skill[]): number {
  if (skills.length === 0) return 0;
  return Math.max(...skills.map((s) => s.sortOrder), -1) + 1;
}