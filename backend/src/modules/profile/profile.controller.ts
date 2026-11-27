import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { ProfileService } from "./profile.service.js";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Public()
  @Get()
  get() {
    return this.profile.get();
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profile.update(dto);
  }
}