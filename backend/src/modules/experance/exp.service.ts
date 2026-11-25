import {
    Injectable,
    NotFoundException,
  } from "@nestjs/common";
  
  import { PrismaService } from "../../prisma/prisma.service.js";
  import { CreateExperienceDto } from "./dto/create_exp.dto.js";
import { ExperienceListDto } from "./dto/list_exp.dto.js";
import { Prisma } from "@prisma/client";
import { UpdateExperienceDto } from "./dto/update_exp.dot.js";
  
  @Injectable()
  export class ExperienceService {
    constructor(private readonly prisma: PrismaService) {}
  
    async createExperience(data: CreateExperienceDto) {
      const { projectIds, ...experienceData } = data;
  
      // Validate selected projects
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
  
      return this.prisma.experience.create({
        data: {
          ...experienceData,
  
          ...(projectIds?.length && {
            projects: {
              connect: projectIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          projects: true,
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
        const { projectIds, ...experienceData } = data;

        if (projectIds?.length) {
            const projects = await this.prisma.project.findMany({
                where: { id: { in: projectIds } },
            });
        }

        if (projectIds?.length && projectIds.length !== new Set(projectIds).size) {
            throw new NotFoundException("One or more projects not found");
        }

        return this.prisma.experience.update({
            where: { id },
            data: {
                ...experienceData,
            },
        });
    }

    async deleteExperience(id: string) {
        return this.prisma.experience.delete({
            where: { id },
        });
    }
  }