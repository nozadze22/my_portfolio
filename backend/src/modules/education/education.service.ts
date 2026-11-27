import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { assertSkillsExist } from "../../common/assert-skills-exist.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateEducationDto } from "./dto/create-education.dto.js";
import { ListEducationDto } from "./dto/list-education.dto.js";
import { UpdateEducationDto } from "./dto/update-education.dto.js";

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEducationDto) {
    const { skillIds, ...educationData } = data;

    if (skillIds !== undefined && skillIds.length > 0) {
      await assertSkillsExist(this.prisma, skillIds);
    }

    return this.prisma.education.create({
      data: {
        ...educationData,
        ...(skillIds?.length && {
          skills: {
            connect: skillIds.map((id) => ({ id })),
          },
        }),
      },
      include: { skills: true },
    });
  }

  async list(query: ListEducationDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.EducationWhereInput = { published: true };

    const [data, total] = await Promise.all([
      this.prisma.education.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
        skip,
        take: limit,
        include: {
          skills: {
            where: { published: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          },
        },
      }),
      this.prisma.education.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async update(id: string, data: UpdateEducationDto) {
    const existing = await this.prisma.education.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException("Education not found");
    }

    const { skillIds, ...educationData } = data;

    if (skillIds !== undefined && skillIds.length > 0) {
      await assertSkillsExist(this.prisma, skillIds);
    }

    return this.prisma.education.update({
      where: { id },
      data: {
        ...educationData,
        ...(skillIds !== undefined && {
          skills: {
            set: skillIds.map((skillId) => ({ id: skillId })),
          },
        }),
      },
      include: { skills: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.education.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException("Education not found");
    }

    return this.prisma.education.delete({ where: { id } });
  }
}