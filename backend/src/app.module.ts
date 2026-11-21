import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { modules } from './modules.js';

@Module({
  imports: [PrismaModule, ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
