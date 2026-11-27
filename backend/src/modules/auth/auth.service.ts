import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<AuthService["sanitizeUser"]>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sanitizeUser(user: {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private refreshTtlMs() {
    return Number(process.env.JWT_REFRESH_EXPIRES_MS ?? 30 * 24 * 60 * 60 * 1000);
  }

  private hashRefreshToken(plain: string) {
    return createHash("sha256").update(plain).digest("hex");
  }

  private async assertRegistrationAllowed() {
    const count = await this.prisma.user.count();
    const open = process.env.REGISTRATION_OPEN === "true";

    if (count === 0) return;

    if (!open) {
      throw new ForbiddenException(
        "Registration is closed. Sign in with an existing admin account.",
      );
    }
  }

  private signAccessToken(sub: string, email: string, role: UserRole) {
    const expiresIn = (process.env.JWT_EXPIRES ?? "15m") as `${number}${"s" | "m" | "h" | "d"}`;
    return this.jwt.signAsync(
      { sub, email, role, typ: "access" as const },
      { expiresIn },
    );
  }

  private async createRefreshToken(userId: string) {
    const plain = randomBytes(32).toString("base64url");
    const tokenHash = this.hashRefreshToken(plain);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs());

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return plain;
  }

  async issueSession(user: {
    id: string;
    email: string;
    fullName: string | null;
    role: UserRole;
    createdAt: Date;
  }): Promise<AuthSession> {
    const accessToken = await this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.createRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async register(dto: RegisterDto) {
    await this.assertRegistrationAllowed();

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const totalUsers = await this.prisma.user.count();
    const role = totalUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName?.trim() || null,
        role,
      },
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.issueSession(user);
  }

  async refresh(plainRefreshToken: string | undefined) {
    if (!plainRefreshToken?.trim()) {
      throw new UnauthorizedException("Missing refresh token");
    }

    const tokenHash = this.hashRefreshToken(plainRefreshToken);
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return this.issueSession(record.user);
  }

  async logout(plainRefreshToken: string | undefined) {
    if (!plainRefreshToken?.trim()) return;

    const tokenHash = this.hashRefreshToken(plainRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.sanitizeUser(user);
  }
}