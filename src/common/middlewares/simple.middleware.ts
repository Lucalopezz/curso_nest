// Cliente -> Servidor -> Middleware (Req, Res) -> Nest (Guards, Interceptors, Pipes, Filters)
// Similar aos Interceptors, mas tem acesso bruto ao servidor

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(req: Request, res: Response, next: NextFunction) {
    // const authorization = req.headers.authorization.split(' ')[1];
    // if (authorization) {
    //   req['user'] = {
    //     nome = 'Lucas',
    //     sobrenome = 'Lopes',
    //   };
    // }

    // res.status(404).send({
    //   messsage: 'Não encontrado',
    // });
    next();
  }
}
