import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { ProjectsService } from "./projects.service.js";
import { ProjectListDto } from "./dto/projects.dto.js";
import { CreateProjectDto } from "./dto/create.dto.js";
import { UpdateProjectDto } from "./dto/update.js";



@Controller('projects')

export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Public()
  @Get()
  findAll(@Query() query: ProjectListDto) {
    return this.projects.projectList(query);
  
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projects.projectDetail(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projects.createProject(dto);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.updateProject(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projects.deleteProject(id);
  }
}