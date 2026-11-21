import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateExperienceDto } from "./dto/create_exp.dto.js";
import { ExperienceService } from "./exp.service.js";
import { ExperienceListDto } from "./dto/list_exp.dto.js";
import { UpdateExperienceDto } from "./dto/update_exp.dot.js";


@Controller('experience')
export class ExperienceController {
    constructor(private readonly experienceService: ExperienceService) {}

    @Post()
    async createExperience(@Body() data: CreateExperienceDto) {
        return this.experienceService.createExperience(data);

    }
    @Get()
    async experienceList(@Query() query: ExperienceListDto) {
        return this.experienceService.experienceList(query);
    }
    @Put(':id')
    async updateExperience(@Param('id') id: string, @Body() data: UpdateExperienceDto) {
        return this.experienceService.updateExperience(id, data);
    }
    @Delete(':id')
    async deleteExperience(@Param('id') id: string) {
        return this.experienceService.deleteExperience(id);
    }
}