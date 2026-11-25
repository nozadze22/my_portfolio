import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { ContactService } from "./contact.service.js";
import { CreateContactDto } from "./dot/contact.dto.js";


@Controller('contact')

export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post("send")
    create(@Body()dto:CreateContactDto){
        return this.contactService.create(dto);
    }

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

