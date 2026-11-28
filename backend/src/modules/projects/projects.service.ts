
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { Prisma } from "@prisma/client";
import { assertSkillsExist } from "../../common/assert-skills-exist.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { ProjectListDto } from "./dto/projects.dto.js";
import { CreateProjectDto } from "./dto/create.dto.js";
import { UpdateProjectDto } from "./dto/update.js";
import { normalizeMediaUrl } from "../../common/normalize-media-url.js";

const skillInclude = {
  where: { published: true },
  orderBy: [
    { category: "asc" as const },
    { sortOrder: "asc" as const },
    { name: "asc" as const },
  ],
};

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

    if (query.skillId) {
      where.skills = { some: { id: query.skillId } };
    }

    if (query.skillSlug) {
      where.skills = { some: { slug: query.skillSlug } };
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
        include: {
          skills: skillInclude,
          experiences: {
            where: { published: true },
            orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
          },
        },
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
      const { skillIds, ...projectData } = data;

      if (skillIds !== undefined && skillIds.length > 0) {
        await assertSkillsExist(this.prisma, skillIds);
      }

      const slug = projectData.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
  
      const existingProject = await this.prisma.project.findUnique({
        where: { slug },
      });
  
      if (existingProject) {
        throw new ConflictException(
          "Project with this slug already exists",
        );
      }
  
      const galleryUrls = (projectData.galleryUrls ?? [])
        .map((u) => normalizeMediaUrl(u))
        .filter((u): u is string => Boolean(u));
      const imageUrl =
        normalizeMediaUrl(projectData.imageUrl) ??
        (galleryUrls.length > 0 ? galleryUrls[0] : undefined);

      return this.prisma.project.create({
        data: {
          title: projectData.title.trim(),
          slug,
          subtitle: projectData.subtitle,
          description: projectData.description,
          category: projectData.category,
          role: projectData.role,
          year: projectData.year,
          imageUrl,
          galleryUrls,
          repoUrl: projectData.repoUrl,
          demoUrl: projectData.demoUrl,
          tags: projectData.tags ?? [],
          technologies: projectData.technologies ?? [],
          featured: projectData.featured ?? false,
          published: true,
          sortOrder: projectData.sortOrder ?? 0,
          ...(skillIds?.length && {
            skills: {
              connect: skillIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          skills: skillInclude,
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
     const { skillIds, ...projectData } = data;

     if (skillIds !== undefined && skillIds.length > 0) {
       await assertSkillsExist(this.prisma, skillIds);
     }

     let galleryUrls = projectData.galleryUrls;
     if (galleryUrls !== undefined) {
       galleryUrls = galleryUrls
         .map((u) => normalizeMediaUrl(u))
         .filter((u): u is string => Boolean(u));
     }

     let imageUrl =
       projectData.imageUrl !== undefined
         ? normalizeMediaUrl(projectData.imageUrl)
         : undefined;
     if (galleryUrls !== undefined) {
       imageUrl = imageUrl ?? galleryUrls[0] ?? null;
     }

     return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(galleryUrls !== undefined ? { galleryUrls, imageUrl } : {}),
        ...(projectData.imageUrl !== undefined && galleryUrls === undefined
          ? { imageUrl }
          : {}),
        slug,
        ...(skillIds !== undefined && {
          skills: {
            set: skillIds.map((skillId) => ({ id: skillId })),
          },
        }),
      },
      include: {
        skills: skillInclude,
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
      include: {
        skills: skillInclude,
        experiences: {
          where: { published: true },
          orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
        },
      },
    });
    if(!project){
      throw new NotFoundException("Project not found");
    }
    return project;
  }
}