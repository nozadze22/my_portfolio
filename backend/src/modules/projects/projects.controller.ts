import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";
import { ProjectListDto } from "./dto/projects.dto.js";
import { CreateProjectDto } from "./dto/create.dto.js";
import { UpdateProjectDto } from "./dto/update.js";



@Controller('projects')

export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll(@Query() query: ProjectListDto) {
    return this.projects.projectList(query);
  
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projects.projectDetail(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projects.createProject(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.updateProject(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projects.deleteProject(id);
  }
}