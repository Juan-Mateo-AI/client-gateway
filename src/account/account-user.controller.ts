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
import { UpdateUserDto } from './dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('account/user')
export class AccountUserController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() currentUser: CurrentUser,
    @Body() userToUpdate: UpdateUserDto,
  ) {
    return this.client
      .send('account.user.update', {
        currentUser,
        userToUpdate,
        userId: id,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() currentUser: CurrentUser,
  ) {
    return this.client
      .send('account.user.get', {
        currentUser,
        userId: id,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get()
  @UseGuards(AuthGuard)
  getUsersByCompany(
    @User() currentUser: CurrentUser,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page, 10) || DEFAULT_PAGE;
    const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

    return this.client
      .send('account.user.getAll', {
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
  deleteUser(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.client
      .send('account.user.delete', {
        currentUser,
        companyId: currentUser.companyId,
        userId: id,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Post()
  @UseGuards(AuthGuard)
  inviteUser(
    @User() currentUser: CurrentUser,
    @Body() userToInvite: InviteUserDto,
  ) {
    return this.client
      .send('account.user.invite', {
        currentUser,
        userToInvite,
      })
      .pipe(
        catchError((error) => {
          console.log('error client gateway', error);
          throw new RpcException(error);
        }),
      );
  }
}
