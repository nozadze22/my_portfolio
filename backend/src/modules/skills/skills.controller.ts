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
import { CreateSkillDto } from "./dto/create-skill.dto.js";
import { ListSkillsDto } from "./dto/list-skills.dto.js";
import { UpdateSkillDto } from "./dto/update-skill.dto.js";
import { SkillsService } from "./skills.service.js";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skills: SkillsService) {}

  @Get("options")
  options() {
    return this.skills.options();
  }

  @Get()
  list(@Query() query: ListSkillsDto) {
    return this.skills.list(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.skills.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skills.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSkillDto) {
    return this.skills.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.skills.remove(id);
  }
}