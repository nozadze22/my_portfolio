import type { SkillCategory } from "../schema/skill.schema";

export const CATEGORY_LABEL: Record<SkillCategory, { title: string; icon: string }> = {
  LANGUAGE: { title: "Languages", icon: "code" },
  FRAMEWORK: { title: "Frameworks", icon: "layers" },
  LIBRARY: { title: "Libraries", icon: "extension" },
  DATABASE: { title: "Data", icon: "database" },
  TOOL: { title: "Tools", icon: "build" },
  PLATFORM: { title: "Platforms", icon: "cloud" },
  OTHER: { title: "Other", icon: "category" },
};