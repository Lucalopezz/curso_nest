import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Não logado!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      //console.log(payload);
      // payload['pessoa'] = pessoa; aqui se fosse usar essa metodo a pessoa teria de estar aqui, usando o findoOneBy com o id do payload.sub, como mostem ai em baixo
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      //console.log(error);

      throw new UnauthorizedException('Falha ao logar', error);
    }

    return true;
    // outro metdodo de fazer o login

    // const request: Request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);

    // if (!token) {
    //   throw new UnauthorizedException('Não logado!');
    // }

    // try {
    //   const payload = await this.jwtService.verifyAsync(
    //     token,
    //     this.jwtConfiguration,
    //   );

    //   const pessoa = await this.pessoaRepository.findOneBy({
    //     id: payload.sub,
    //     active: true,
    //   });

    //   if (!pessoa) {
    //     throw new UnauthorizedException('Pessoa não autorizada');
    //   }

    //   payload['pessoa'] = pessoa; adiciona token na req

    //   request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    // } catch (error) {
    //   throw new UnauthorizedException(error.message);
    // }

    // return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return;
    }

    return authorization.split(' ')[1];
  }
}
