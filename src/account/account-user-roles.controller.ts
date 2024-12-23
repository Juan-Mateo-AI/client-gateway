import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Get,
  UseGuards,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Controller('account/userRoles')
export class AccountUserRolesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @UseGuards(AuthGuard)
  createUserRole(
    @User() currentUser: CurrentUser,
    @Body() userRole: CreateUserRoleDto,
  ) {
    return this.client
      .send('account.userRoles.create', {
        currentUser,
        userRole,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUserRole(
    @Param('id', new ParseUUIDPipe()) userRoleId: string,
    @User() currentUser: CurrentUser,
    @Body() userRole: CreateUserRoleDto,
  ) {
    return this.client
      .send('account.userRoles.update', {
        currentUser,
        userRole,
        userRoleId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserRole(
    @Param('id', new ParseUUIDPipe()) userRoleId: string,
    @User() currentUser: CurrentUser,
  ) {
    return this.client
      .send('account.userRoles.get', {
        currentUser,
        userRoleId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get()
  @UseGuards(AuthGuard)
  getUserRolesByCompany(
    @User() currentUser: CurrentUser,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page, 10) || DEFAULT_PAGE;
    const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

    return this.client
      .send('account.userRoles.getAll', {
        currentUser,
        companyId: currentUser.companyId,
        page: pageNumber,
        pageSize: size,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserRole(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) userRoleId: string,
  ) {
    return this.client
      .send('account.userRoles.delete', {
        currentUser,
        companyId: currentUser.companyId,
        userRoleId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
