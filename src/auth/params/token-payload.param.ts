import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

export const TokenPayloadParam = createParamDecorator(
  // da request tenta pegar o token payload
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();
    return request[REQUEST_TOKEN_PAYLOAD_KEY];
  },
);
