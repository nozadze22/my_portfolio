import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator.js";

type RequestUser = { userId: string; email: string; role: UserRole };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException("Authentication required");
    }

    if (!required.includes(user.role)) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}