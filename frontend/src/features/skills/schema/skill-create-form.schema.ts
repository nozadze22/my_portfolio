import { z } from "zod";
import {
  SKILL_CATALOG_CATEGORIES,
  skillCatalogCategorySchema,
  type SkillCatalogCategory,
  type SkillCategory,
} from "./skill.schema";
import type { CreateSkillInput, Skill } from "./skill.schema";
import {
  resolveSkillIconUrl,
  slugifySkillName,
} from "../lib/skill-form-auto";

export const skillCreateFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  category: skillCatalogCategorySchema,
  published: z.boolean(),
  sortOrder: z.number().int().min(0, "Order must be 0 or higher"),
});

export type SkillCreateFormValues = z.infer<typeof skillCreateFormSchema>;

export const skillCreateFormDefaults: SkillCreateFormValues = {
  name: "",
  category: "OTHER",
  published: true,
  sortOrder: 0,
};

function toCatalogCategory(category: SkillCategory): SkillCatalogCategory {
  if (SKILL_CATALOG_CATEGORIES.includes(category as SkillCatalogCategory)) {
    return category as SkillCatalogCategory;
  }
  return "OTHER";
}

export function skillToFormValues(skill: Skill): SkillCreateFormValues {
  return {
    name: skill.name,
    category: toCatalogCategory(skill.category),
    published: skill.published,
    sortOrder: skill.sortOrder,
  };
}

export function skillCreateFormToPayload(
  values: SkillCreateFormValues,
  mode: "create" | "update",
  nextSort?: number,
): CreateSkillInput {
  const slug = slugifySkillName(values.name);
  const iconUrl = resolveSkillIconUrl(values.name);
  const payload: CreateSkillInput = {
    name: values.name.trim(),
    category: values.category,
    published: values.published,
    sortOrder: mode === "create" ? (nextSort ?? 0) : values.sortOrder,
  };
  if (slug) payload.slug = slug;
  if (iconUrl) payload.iconUrl = iconUrl;
  return payload;
}