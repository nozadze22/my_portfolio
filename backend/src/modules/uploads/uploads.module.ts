import { Module } from "@nestjs/common";

import { R2StorageService } from "./r2-storage.service.js";
import { UploadsController } from "./uploads.controller.js";
import { UploadsService } from "./uploads.service.js";

@Module({
  controllers: [UploadsController],
  providers: [R2StorageService, UploadsService],
  exports: [R2StorageService, UploadsService],
})
export class UploadsModule {}