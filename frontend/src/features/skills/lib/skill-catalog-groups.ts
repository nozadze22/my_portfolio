import type { SkillCategory } from "../schema/skill.schema";
import { SKILL_CATALOG_CATEGORIES, type SkillCatalogCategory } from "../schema/skill.schema";

type WithCategory = { category: SkillCategory };

/** Legacy DATABASE / PLATFORM skills roll into Other for display. */
export function groupSkillsByCatalogCategory<T extends WithCategory>(
  items: T[],
): Record<SkillCatalogCategory, T[]> {
  const buckets = Object.fromEntries(
    SKILL_CATALOG_CATEGORIES.map((key) => [key, [] as T[]]),
  ) as Record<SkillCatalogCategory, T[]>;

  for (const item of items) {
    const cat = item.category;
    if (SKILL_CATALOG_CATEGORIES.includes(cat as SkillCatalogCategory)) {
      buckets[cat as SkillCatalogCategory].push(item);
    } else {
      buckets.OTHER.push(item);
    }
  }

  return buckets;
}

export function mergeOptionsByCategory<T extends WithCategory>(
  byCategory: Partial<Record<SkillCategory, T[]>>,
): Record<SkillCatalogCategory, T[]> {
  const flat = Object.values(byCategory).flat();
  return groupSkillsByCatalogCategory(flat);
}