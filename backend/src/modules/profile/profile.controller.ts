import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { ProfileService } from "./profile.service.js";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get()
  get() {
    return this.profile.get();
  }

  @Patch()
  update(
    @Headers("x-admin-key") adminKey: string | undefined,
    @Body() dto: UpdateProfileDto,
  ) {
    const expected = process.env.ADMIN_API_KEY;

    if (!expected || adminKey !== expected) {
      throw new UnauthorizedException("Invalid admin key");
    }

    return this.profile.update(dto);
  }
}