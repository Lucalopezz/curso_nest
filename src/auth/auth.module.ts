import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bycrpt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global() // pode ser ultilizado na aplicação interia, sem precisar importar em  outros modulos
@Module({
  providers: [
    {
      provide: HashingService, // exporta a de baixo com o nome dessa, que é so um molde
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule],

  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
