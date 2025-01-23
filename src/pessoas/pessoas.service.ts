import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const passwordHash = await this.hashingService.hash(
      createPessoaDto.password,
    );
    try {
      const pessoaData = {
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(pessoaData);

      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        id: 'DESC',
      },
    });
    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
    };
    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );
      dadosPessoa['passwordHash'] = passwordHash;
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não pode atualizar outra pessoa');
    }
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    if (id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não pode deletar outra pessoa');
    }
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) throw new NotFoundException('Pessoa não encontrada');

    await this.pessoaRepository.remove(pessoa);

    return {
      message: 'Pessoa apagada com sucesso',
    };
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024) {
      throw new BadRequestException('File too small');
    }
    const pessoa = await this.findOne(tokenPayload.sub);

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    // aqui recomenda-se o uso de bibliotecas para melhor validação de arquivos, pois um hacker ainda consegue colocar aruivos maliciosos no servidor
    // São exemplos dessas libs: file-type, image-type, sharp -- elas não usam javascript
    await fs.writeFile(fileFullPath, file.buffer);

    pessoa.picture = fileName;
    await this.pessoaRepository.save(pessoa);

    return 'Foto salva';
  }
}
