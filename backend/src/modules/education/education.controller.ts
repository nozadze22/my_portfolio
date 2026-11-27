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
import { CreateEducationDto } from "./dto/create-education.dto.js";
import { ListEducationDto } from "./dto/list-education.dto.js";
import { UpdateEducationDto } from "./dto/update-education.dto.js";
import { EducationService } from "./education.service.js";

@Controller("education")
export class EducationController {
  constructor(private readonly education: EducationService) {}

  @Get()
  list(@Query() query: ListEducationDto) {
    return this.education.list(query);
  }

  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.education.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateEducationDto) {
    return this.education.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.education.remove(id);
  }
}