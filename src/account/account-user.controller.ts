import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';
import { UpdateUserDto } from './dto';

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
    console.log('currentUser', currentUser)
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
}
