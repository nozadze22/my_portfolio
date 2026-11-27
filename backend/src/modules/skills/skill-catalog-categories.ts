import { SkillCategory } from "@prisma/client";

/** Allowed categories for new/updated skills in admin */
export const SKILL_CATALOG_CATEGORIES = [
  SkillCategory.LANGUAGE,
  SkillCategory.FRAMEWORK,
  SkillCategory.LIBRARY,
  SkillCategory.TOOL,
  SkillCategory.OTHER,
] as const;