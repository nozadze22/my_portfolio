import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UserRole } from "@prisma/client";
import { memoryStorage } from "multer";

import { Roles } from "../../common/decorators/roles.decorator.js";
import type { UploadScope } from "./r2-storage.service.js";
import { UploadsService } from "./uploads.service.js";

const SCOPES = new Set<UploadScope>(["projects", "profile", "misc"]);

function parseScope(value?: string): UploadScope {
  const scope = (value ?? "projects") as UploadScope;
  if (!SCOPES.has(scope)) {
    throw new BadRequestException(`Invalid scope. Use one of: ${[...SCOPES].join(", ")}`);
  }
  return scope;
}

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Roles(UserRole.ADMIN)
  @Post("images")
  @UseInterceptors(
    FilesInterceptor("files", 12, {
      storage: memoryStorage(),
    }),
  )
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query("scope") scope?: string,
  ) {
    return this.uploads.saveImages(files ?? [], parseScope(scope));
  }

  @Roles(UserRole.ADMIN)
  @Post("project-images")
  @UseInterceptors(
    FilesInterceptor("files", 12, {
      storage: memoryStorage(),
    }),
  )
  uploadProjectImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploads.saveProjectImages(files ?? []);
  }
}