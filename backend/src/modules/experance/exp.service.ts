import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from "@nestjs/common";
  
  import { assertSkillsExist } from "../../common/assert-skills-exist.js";
  import { parseDateOnly } from "../../common/parse-date-only.js";
  import { PrismaService } from "../../prisma/prisma.service.js";
  import { CreateExperienceDto } from "./dto/create_exp.dto.js";
import { ExperienceListDto } from "./dto/list_exp.dto.js";
import { Prisma } from "@prisma/client";
import { UpdateExperienceDto } from "./dto/update_exp.dot.js";
  
  @Injectable()
  export class ExperienceService {
    constructor(private readonly prisma: PrismaService) {}
  
    async createExperience(data: CreateExperienceDto) {
      const { projectIds, skillIds, startDate, endDate, ...experienceData } = data;

      if (skillIds !== undefined && skillIds.length > 0) {
        await assertSkillsExist(this.prisma, skillIds);
      }
  
      if (projectIds?.length) {
        const projects = await this.prisma.project.findMany({
          where: {
            id: { in: projectIds },
          },
          select: {
            id: true,
          },
        });
  
        if (projects.length !== new Set(projectIds).size) {
          throw new NotFoundException("One or more projects not found");
        }
      }
  
      const parsedStart = parseDateOnly(startDate);
      if (!parsedStart) {
        throw new BadRequestException("Invalid startDate");
      }

      return this.prisma.experience.create({
        data: {
          ...experienceData,
          startDate: parsedStart,
          endDate: parseDateOnly(endDate),

          ...(projectIds?.length && {
            projects: {
              connect: projectIds.map((id) => ({ id })),
            },
          }),
          ...(skillIds?.length && {
            skills: {
              connect: skillIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          projects: true,
          skills: true,
        },
      });
    }

    async experienceList(query: ExperienceListDto) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
      
        const skip = (page - 1) * limit;
      
        const where: Prisma.ExperienceWhereInput = {
          published: true,
        };
      
        const [experiences, total] = await Promise.all([
          this.prisma.experience.findMany({
            where,
            orderBy: [
              { sortOrder: "asc" },
              { startDate: "desc" },
            ],
            skip,
            take: limit,
            include: {
              projects: true,
              skills: true,
            },
          }),
      
          this.prisma.experience.count({
            where,
          }),
        ]);
      
        return {
          data: experiences,
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

    async updateExperience(id: string, data: UpdateExperienceDto) {
      const existing = await this.prisma.experience.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException("Experience not found");
      }

      const { projectIds, skillIds, startDate, endDate, ...experienceData } = data;

      if (skillIds !== undefined && skillIds.length > 0) {
        await assertSkillsExist(this.prisma, skillIds);
      }

      if (projectIds !== undefined && projectIds.length > 0) {
        const projects = await this.prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true },
        });

        if (projects.length !== new Set(projectIds).size) {
          throw new NotFoundException("One or more projects not found");
        }
      }

      return this.prisma.experience.update({
        where: { id },
        data: {
          ...experienceData,
          ...(startDate !== undefined && {
            startDate: parseDateOnly(startDate),
          }),
          ...(endDate !== undefined && {
            endDate: parseDateOnly(endDate),
          }),
          ...(projectIds !== undefined && {
            projects: {
              set: projectIds.map((projectId) => ({ id: projectId })),
            },
          }),
          ...(skillIds !== undefined && {
            skills: {
              set: skillIds.map((skillId) => ({ id: skillId })),
            },
          }),
        },
        include: {
          projects: true,
          skills: true,
        },
      });
    }

    async deleteExperience(id: string) {
      const existing = await this.prisma.experience.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException("Experience not found");
      }

      return this.prisma.experience.delete({
        where: { id },
      });
    }
  }