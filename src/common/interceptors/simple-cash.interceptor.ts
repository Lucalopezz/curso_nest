import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { of, tap } from 'rxjs';

export class SimpleCashInterceptor implements NestInterceptor {
  private readonly cach = new Map();
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    if (this.cach.has(url)) {
      console.log('Esta no cash', url);
      return of(this.cach.get(url));
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap((data) => {
        this.cach.set(url, data);
        console.log('Armazanado em cash', url);
      }),
    );
  }
}
