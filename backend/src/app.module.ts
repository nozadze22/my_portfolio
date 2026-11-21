import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { ContactModule } from './modules/contact/conatct.module.js';

@Module({
  imports: [PrismaModule, ProjectsModule, ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
