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
import { CreateEducationDto } from "./dto/create-education.dto.js";
import { ListEducationDto } from "./dto/list-education.dto.js";
import { UpdateEducationDto } from "./dto/update-education.dto.js";
import { EducationService } from "./education.service.js";

@Controller("education")
export class EducationController {
  constructor(private readonly education: EducationService) {}

  @Public()
  @Get()
  list(@Query() query: ListEducationDto) {
    return this.education.list(query);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.education.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateEducationDto) {
    return this.education.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.education.remove(id);
  }
}