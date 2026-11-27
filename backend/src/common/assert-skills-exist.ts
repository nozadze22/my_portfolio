import { NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service.js";

export async function assertSkillsExist(
  prisma: PrismaService,
  skillIds: string[],
) {
  if (skillIds.length === 0) {
    return;
  }

  const skills = await prisma.skill.findMany({
    where: { id: { in: skillIds } },
    select: { id: true },
  });

  if (skills.length !== new Set(skillIds).size) {
    throw new NotFoundException("One or more skills not found");
  }
}