import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { CreateSkillDto } from "./dto/create-skill.dto.js";
import { ListSkillsDto } from "./dto/list-skills.dto.js";
import { UpdateSkillDto } from "./dto/update-skill.dto.js";
import { SkillsService } from "./skills.service.js";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skills: SkillsService) {}

  @Public()
  @Get("options")
  options() {
    return this.skills.options();
  }

  @Public()
  @Get()
  list(@Query() query: ListSkillsDto) {
    return this.skills.list(query);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.skills.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skills.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSkillDto) {
    return this.skills.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.skills.remove(id);
  }
}