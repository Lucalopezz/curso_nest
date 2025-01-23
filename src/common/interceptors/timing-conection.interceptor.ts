import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const now = Date.now();
    console.log(`antes`);

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elapsed = finalTime - now;
        console.log(`Demorou ${elapsed} ms`);
      }),
    );
  }
}
