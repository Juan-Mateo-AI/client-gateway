import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from '../account/guards/auth.guard';
import { CurrentUser } from '../account/interfaces/current-user.interface';
import { User } from '../account/decorators';
import { UserAuthDto } from './dto/user-auth.dto';

@Controller('ai/user-auths')
export class AIUserAuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('')
  @UseGuards(AuthGuard)
  createUserAuth(@User() currentUser: CurrentUser, @Body() userAuthToCreate: UserAuthDto) {
    return this.client
      .send('user_auth.create', {
        ...userAuthToCreate,
        reference_id: currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getUserAuth(@User() currentUser: CurrentUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.client
      .send('user_auth.get_by_id', {
        user_auth_id: id,
        reference_id: currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get('')
  @UseGuards(AuthGuard)
  getUserAuths(@User() currentUser: CurrentUser, @Query('referenceId') referenceId: string) {
    return this.client
      .send('user_auth.get_by_ref_id', {
        reference_id: referenceId || currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updateUserAuth(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userAuthToUpdate: UserAuthDto,
  ) {
    return this.client
      .send('user_auth.update', {
        user_auth_id: id,
        ...userAuthToUpdate,
        reference_id: currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteUserAuth(@User() currentUser: CurrentUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.client
      .send('user_auth.delete', {
        user_auth_id: id,
        reference_id: currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
