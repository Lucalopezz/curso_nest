import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //em 60 sec
        limit: 60, // a pessoa pode fazer 60 requisição
        blockDuration: 5000, // se passar disso, 5sec de bloqueio
      },
    ]),
    ConfigModule.forFeature(globalConfig), // utilizando o .env de forma mais parruda
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfigurations: ConfigType<typeof globalConfig>,
      ) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          database: globalConfigurations.database.database,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
      serveRoot: '/pictures',
    }),
    RecadosModule,
    PessoasModule,
    GlobalConfigModule, // tem q importar o module de configuração
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
