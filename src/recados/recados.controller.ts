import {
  Body,
  Controller,
  Delete,
  Get,
  // Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  //UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AuthTokenGuard } from 'src/auth/gards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

// import { RoutePolicyGuard } from 'src/auth/gards/route-policy.guard';
// import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
// import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

// import { MyDynamicModuleConfigs } from 'src/my-dynamic/my-dynamic.module';
// import { RegexProtocol } from 'src/common/regex/regex.protocol';
// import { REMOVE_SPACES_REGEX } from './recados.constants';
//import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
// import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
// import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-conection.interceptor';
// import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
//import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
//import { SimpleCashInterceptor } from 'src/common/interceptors/simple-cash.interceptor';

//@UseInterceptors(SimpleCashInterceptor)
//@UseInterceptors(ChangeDataInterceptor)
@UsePipes(ParseIntIdPipe)
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    // @Inject(REMOVE_SPACES_REGEX)
    // private readonly removeSpacesRegex: RegexProtocol,
    // private readonly myDynamicConfigs: MyDynamicModuleConfigs,
  ) {}

  //@HttpCode(201)
  //@UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  //@UseInterceptors(AuthTokenInterceptor)
  @Get()
  // @SetRoutePolicy(RoutePolicies.findAllRecados) aqui é o exemplo de como adicionariamos uma rota com uma permissao de apenas enconbtrat recados
  // @UseGuards(AuthTokenGuard, RoutePolicyGuard) tem q ser nessa ordem, primeiro
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log(this.removeSpacesRegex.execute('Teste OK'));
    const recados = this.recadosService.findAll(paginationDto);
    return recados;
  }

  //@UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findeOne(id);
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  create(
    @Body() createReacdoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createReacdoDto, tokenPayload);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
