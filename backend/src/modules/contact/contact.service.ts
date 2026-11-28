import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateContactDto } from "./dot/contact.dto.js";


@Injectable()
export class ContactService {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        this.prisma = prisma;
    }

   async create(dto:CreateContactDto){
    const message = await this.prisma.contactMessage.create({
        data:{
            name: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            message: dto.message,
        },
    });
        return message;
   }

   async findAll(page = 1, limit = 10) {
    // Validate pagination parameters
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Math.max(1, Number(limit) || 10));

    const skip = (page - 1) * limit;

    // Fetch messages and total count simultaneously
    const [messages, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
        take: limit,
        skip,
      }),

      this.prisma.contactMessage.count(),
    ]);

    const unreadCount = await this.prisma.contactMessage.count({
      where: { isRead: false },
    });

    return {
      data: messages,
      meta: {
        total,
        unread: unreadCount,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async markRead(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return null;
    }
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });
  }
}