import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from '../account/guards/auth.guard';
import { CurrentUser } from '../account/interfaces/current-user.interface';
import { User } from '../account/decorators';
import { UserAuthDto } from './dto/user-authorization';

@Controller('ai-messaging/user-auths')
export class AIMessagingUserAuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('')
  @UseGuards(AuthGuard)
  createUserAuth(
    @User() currentUser: CurrentUser,
    @Body() userAuthToCreate: UserAuthDto,
  ) {
    return this.client
      .send('ai_create_user_authorization', {
        data: {
          ...userAuthToCreate,
          reference_id: currentUser.companyId,
        },
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getUserAuth(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.client
      .send('ai_get_user_authorization', {
        data: {
          id: id,
          reference_id: currentUser.companyId,
        },
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get('')
  @UseGuards(AuthGuard)
  getUserAuths(
    @User() currentUser: CurrentUser,
    @Query('referenceId') referenceId: string,
  ) {
    return this.client
      .send('ai_get_user_authorizations', {
        data: {},
        query: {
          reference_id: referenceId,
        },
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
