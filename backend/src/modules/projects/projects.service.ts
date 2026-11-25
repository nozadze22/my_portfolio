
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service.js";
import { ProjectListDto } from "./dto/projects.dto.js";
import { CreateProjectDto } from "./dto/create.dto.js";
import { UpdateProjectDto } from "./dto/update.js";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Get projects with pagination and filters
  async projectList(query: ProjectListDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(query.limit) || 10),
    );

    const skip = (page - 1) * limit;

    // Build filters
    const where: Prisma.ProjectWhereInput = {
      published: true,
    };

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Fetch projects and total count
    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: query.sortOrder ?? "desc",
          },
        ],
        skip,
        take: limit,
      }),

      this.prisma.project.count({
        where,
      }),
    ]);

    return {
      data: projects,
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

    async createProject(data: CreateProjectDto) {
      const slug = data.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
  
      // Check existing slug
      const existingProject = await this.prisma.project.findUnique({
        where: { slug },
      });
  
      if (existingProject) {
        throw new ConflictException(
          "Project with this slug already exists",
        );
      }
  
      return this.prisma.project.create({
        data: {
          title: data.title.trim(),
          slug,
          subtitle: data.subtitle,
          description: data.description,
          category: data.category,
          role: data.role,
          year: data.year,
          imageUrl: data.imageUrl,
          repoUrl: data.repoUrl,
          demoUrl: data.demoUrl,
  
          tags: data.tags ?? [],
          technologies: data.technologies ?? [],
  
          featured: data.featured ?? false,
          published: true,
          sortOrder: data.sortOrder ?? 0,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          description: true,
          category: true,
          role: true,
          year: true,
          imageUrl: true,
          repoUrl: true,
          demoUrl: true,
          tags: true,
          technologies: true,
          featured: true,
          published: true,
          sortOrder: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }


  async updateProject(id: string, data: UpdateProjectDto){
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if(!project){
      throw new NotFoundException("Project not found");
    }
     const slug = data.slug
     ?data.slug.trim().toLowerCase().replace(/\s+/g, "-")
     :undefined;

     if(slug && slug !== project.slug){
      const existingProject = await this.prisma.project.findUnique({
        where: { slug },
      });
      if(existingProject){
        throw new ConflictException("Project with this slug already exists");
      }
     }
     return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
     });
  }

  async deleteProject(id: string){
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if(!project){
      throw new NotFoundException("Project not found");
    }
    return this.prisma.project.delete({
      where: { id },
    });
  }
 
  async projectDetail(id: string){
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if(!project){
      throw new NotFoundException("Project not found");
    }
    return project;
  }
}