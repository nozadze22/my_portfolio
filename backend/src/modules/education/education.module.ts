import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { EducationController } from "./education.controller.js";
import { EducationService } from "./education.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}