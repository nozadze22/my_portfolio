import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { UserRole } from "@prisma/client";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ACCESS_TOKEN_COOKIE } from "../../common/auth/cookie-options.js";

type JwtPayload = { sub: string; email: string; role: UserRole; typ?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.[ACCESS_TOKEN_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "change-me-in-production",
    });
  }

  validate(payload: JwtPayload) {
    if (payload.typ && payload.typ !== "access") {
      return null;
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}