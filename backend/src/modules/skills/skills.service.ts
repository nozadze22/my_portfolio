import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, SkillCategory } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateSkillDto } from "./dto/create-skill.dto.js";
import { ListSkillsDto } from "./dto/list-skills.dto.js";
import { UpdateSkillDto } from "./dto/update-skill.dto.js";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSkillDto) {
    const slug = slugify(data.slug ?? data.name);

    const existing = await this.prisma.skill.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException("Skill with this slug already exists");
    }

    return this.prisma.skill.create({
      data: {
        name: data.name.trim(),
        slug,
        category: data.category ?? SkillCategory.OTHER,
        iconUrl: data.iconUrl,
        color: data.color,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async list(query: ListSkillsDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(query.limit) || 100));
    const skip = (page - 1) * limit;

    const where: Prisma.SkillWhereInput = {};

    if (query.published !== undefined) {
      where.published = query.published;
    } else {
      where.published = true;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { slug: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        orderBy: [
          { category: "asc" },
          { sortOrder: "asc" },
          { name: "asc" },
        ],
        skip,
        take: limit,
      }),
      this.prisma.skill.count({ where }),
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

  /** Lightweight grouped catalog for multi-select UIs */
  async options() {
    const skills = await this.prisma.skill.findMany({
      where: { published: true },
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        iconUrl: true,
        color: true,
      },
    });

    const byCategory = skills.reduce(
      (acc, skill) => {
        const key = skill.category;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(skill);
        return acc;
      },
      {} as Record<SkillCategory, typeof skills>,
    );

    return {
      data: skills,
      byCategory,
    };
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException("Skill not found");
    }
    return skill;
  }

  async update(id: string, data: UpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException("Skill not found");
    }

    const slug = data.slug
      ? slugify(data.slug)
      : data.name
        ? slugify(data.name)
        : undefined;

    if (slug && slug !== skill.slug) {
      const existing = await this.prisma.skill.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException("Skill with this slug already exists");
      }
    }

    const updateData: Prisma.SkillUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }
    if (slug !== undefined) {
      updateData.slug = slug;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
    }
    if (data.iconUrl !== undefined) {
      updateData.iconUrl = data.iconUrl;
    }
    if (data.color !== undefined) {
      updateData.color = data.color;
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }
    if (data.sortOrder !== undefined) {
      updateData.sortOrder = data.sortOrder;
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException("Skill not found");
    }

    return this.prisma.skill.delete({ where: { id } });
  }
}