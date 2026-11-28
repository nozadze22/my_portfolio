import { Module } from "@nestjs/common";
import { ExperienceController } from "./exp.controller.js";
import { ExperienceService } from "./exp.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}