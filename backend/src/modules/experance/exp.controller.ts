import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { CreateExperienceDto } from "./dto/create_exp.dto.js";
import { ExperienceService } from "./exp.service.js";
import { ExperienceListDto } from "./dto/list_exp.dto.js";
import { UpdateExperienceDto } from "./dto/update_exp.dot.js";
import { listEmploymentTypeOptions } from "./employment-type.options.js";


@Controller('experience')
export class ExperienceController {
    constructor(private readonly experienceService: ExperienceService) {}

    @Public()
    @Get('employment-types')
    employmentTypes() {
        return { data: listEmploymentTypeOptions() };
    }

    @Roles(UserRole.ADMIN)
    @Post()
    async createExperience(@Body() data: CreateExperienceDto) {
        return this.experienceService.createExperience(data);

    }
    @Public()
    @Get()
    async experienceList(@Query() query: ExperienceListDto) {
        return this.experienceService.experienceList(query);
    }
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateExperience(@Param('id') id: string, @Body() data: UpdateExperienceDto) {
        return this.experienceService.updateExperience(id, data);
    }
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteExperience(@Param('id') id: string) {
        return this.experienceService.deleteExperience(id);
    }
}