import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  // ParseFilePipe,
  // MaxFileSizeValidator,
  // FileTypeValidator,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from 'src/auth/gards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pessoasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.pessoasService.update(id, updatePessoaDto, tokenPayload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.pessoasService.remove(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({ maxSize: 1 * (1024 * 1024) }),
      //     new FileTypeValidator({ fileType: 'image/jpg' }),
      //   ],
      // }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 10 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.pessoasService.uploadPicture(file, tokenPayload);
  }

  // PARA O UPLOAD DE MULTIPLOS ARQUIVOS

  // @UseGuards(AuthTokenGuard)
  // @UseInterceptors(FilesInterceptor('file'))
  // @Post('upload-picture')
  // async uploadPicture(
  //   @UploadedFiles() files: Array<Express.Multer.File>, aqui muda pra files
  //   @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  // ) {
  //   const result = [];
  //   files.forEach(async file => {
  //     const fileExtension = path
  //       .extname(file.originalname)
  //       .toLowerCase()
  //       .substring(1);
  //     const fileName = `${randomUUID()}.${fileExtension}`;
  //     const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

  //     result.push(fileFullPath);

  //     await fs.writeFile(fileFullPath, file.buffer);
  //   });

  //   return result;
  // }
}
