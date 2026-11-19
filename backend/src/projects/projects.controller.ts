import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll() {
    return this.projects.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.projects.findFeatured();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const project = await this.projects.findBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project "${slug}" not found`);
    }
    return project;
  }
}