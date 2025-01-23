import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  private async createTokens(pessoa: Pessoa) {
    // Fazer um novo token e entregar para o usuário na resposta
    const accessToken = await this.signJwtAsync<Partial<Pessoa>>(
      pessoa.id,
      this.jwtConfiguration.jwtTtl,
      { email: pessoa.email },
    );
    const refreshToken = await this.signJwtAsync(
      pessoa.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(LoginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    const pessoa = await this.pessoaRepository.findOneBy({
      email: LoginDto.email,
      active: true,
    });
    if (pessoa) {
      passwordIsValid = await this.hashingService.compare(
        // retorna true e false, comparando oq esta no hash com oq a pessoa enviou
        LoginDto.password,
        pessoa.passwordHash,
      );
    }
    if (passwordIsValid) {
      throwError = false;
    }
    if (throwError) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    return this.createTokens(pessoa);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );
      const pessoa = await this.pessoaRepository.findOneBy({
        id: sub,
        active: true,
      });
      if (!pessoa) {
        throw new Error('Pessoa não encontrada');
      }
      return this.createTokens(pessoa);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
