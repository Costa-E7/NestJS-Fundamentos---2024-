import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from 'src/decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    // private readonly authService: AuthService,
    // private readonly userService: UserService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Promise<boolean> {
    const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requeridRoles) true;

    const { user } = context.switchToHttp().getRequest();
    const roleFiltred = requeridRoles.filter((role) => role === user.role);
    return roleFiltred.length > 0;
  }
}
