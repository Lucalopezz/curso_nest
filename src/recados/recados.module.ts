import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
// import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';
// import { RegexProtocol } from 'src/common/regex/regex.protocol';
// import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
// import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
// import {
//   ONLY_LOWERCASE_LETTERS_REGEX,
//   REMOVE_SPACES_REGEX,
// } from './recados.constants';

// em caso de dependencia circular( modulo pessoa importa o recados e o recados importa pessoa) usar o fowaardRef(() => MODULO)
@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    PessoasModule,
    // MyDynamicModule.register({
    //   apiKey: '1234',
    //   apiUrl: 'http://blabla',
    // }),
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, // token
      useValue: RecadosUtils, // valor a ser usado
    },
    // {
    //   provide: RegexProtocol,
    //   useClass: 1 === 1 ? RemoveSpacesRegex : OnlyLowercaseLettersRegex,
    // },
    // {
    //   provide: ONLY_LOWERCASE_LETTERS_REGEX,
    //   useClass: OnlyLowercaseLettersRegex,
    // },
    // {
    //   provide: REMOVE_SPACES_REGEX,
    //   useClass: RemoveSpacesRegex,
    // },
  ],
})
export class RecadosModule {}
