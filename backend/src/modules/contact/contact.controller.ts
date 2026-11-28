import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { ContactService } from "./contact.service.js";
import { CreateContactDto } from "./dot/contact.dto.js";


@Controller('contact')

export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Public()
    @Post("send")
    create(@Body()dto:CreateContactDto){
        return this.contactService.create(dto);
    }

    @Roles(UserRole.ADMIN)
    @Get("list")
    findAll(
      @Query("page") page?: string,
      @Query("limit") limit?: string,
    ) {
      return this.contactService.findAll(
        Number(page) || 1,
        Number(limit) || 10,
      );
    }
}

