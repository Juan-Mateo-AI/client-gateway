import {
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';
import { CompanyDto } from './dto';

@Controller('account/company')
export class AccountCompanyController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateCompany(
    @Param('id', new ParseUUIDPipe()) companyId: string,
    @Body() company: CompanyDto,
    @User() currentUser: CurrentUser,
  ) {
    return this.client
      .send('account.company.update', {
        currentUser,
        companyId,
        company,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getCompany(
    @Param('id', new ParseUUIDPipe()) companyId: string,
    @User() currentUser: CurrentUser,
  ) {
    return this.client
      .send('account.company.get', {
        currentUser,
        companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
