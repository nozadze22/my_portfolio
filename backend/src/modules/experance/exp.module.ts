import { Module } from "@nestjs/common";
import { ExperienceController } from "./exp.controller.js";
import { ExperienceService } from "./exp.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";

@Module({
    controllers: [ExperienceController],
    providers: [ExperienceService, PrismaService],
})
export class ExperienceModule {}