import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from "@shared/guard/token.service";
import { Request } from 'express';
import { DocumentType } from "@typegoose/typegoose";
import { User } from "@shared/model/user.model";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private tokenService: TokenService ,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const ignoreExpiration = this.reflector.get<boolean>('ignoreExpiration', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & {user: DocumentType<User>}>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return false;
    }

    const token = authorization.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, { ignoreExpiration });
      const user = await this.tokenService.validateUserToken(payload.sub, token);
      if (!user) {
        return false;
      }
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
