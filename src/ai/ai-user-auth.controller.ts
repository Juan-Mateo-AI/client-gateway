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
import { catchError, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../account/guards/auth.guard';
import { CurrentUser } from '../account/interfaces/current-user.interface';
import { User } from '../account/decorators';
import { UserAuthDto } from './dto/user-auth.dto';

@Controller('ai/user-auths')
export class AIUserAuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUserAuth(@User() currentUser: CurrentUser, @Body() userAuthToCreate: UserAuthDto) {
    try {
      return firstValueFrom(
        this.client
          .send('user_auths.create', {
            ...userAuthToCreate,
            reference_id: currentUser.companyId,
          })
          .pipe(
            catchError((error) => {
              throw new RpcException(error);
            }),
            map((response) => {
              // Check if response has an error field
              if (response && response.error) {
                throw new RpcException({
                  status: response.status || 500,
                  data: { error: response.error },
                });
              }

              // Return the response directly
              return response as UserAuthDto;
            }),
          ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUserAuth(@User() currentUser: CurrentUser, @Param('id') id: string) {
    return firstValueFrom(
      this.client
        .send('user_auths.get_by_id', {
          user_auth_id: id,
          reference_id: currentUser.companyId,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
          map((response) => {
            // Check if response has an error field
            if (response && response.error) {
              throw new RpcException({
                status: response.status || 500,
                data: { error: response.error },
              });
            }

            // Return the response directly
            return response as UserAuthDto;
          }),
        ),
    );
  }

  @Get('')
  @UseGuards(AuthGuard)
  async getUserAuths(@User() currentUser: CurrentUser, @Query('referenceId') referenceId: string) {
    return await firstValueFrom(
      this.client
        .send('user_auths.get_by_ref_id', {
          reference_id: referenceId || currentUser.companyId,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
          map((response) => {
            // Check if response has an error field
            if (response && response.error) {
              throw new RpcException({
                status: response.status || 500,
                data: { error: response.error },
              });
            }

            // Return the response directly
            return response as UserAuthDto[];
          }),
        ),
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateUserAuth(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userAuthToUpdate: UserAuthDto,
  ) {
    return firstValueFrom(
      this.client
        .send('user_auths.update', {
          user_auth_id: id,
          ...userAuthToUpdate,
          reference_id: currentUser.companyId,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
          map((response) => {
            // Check if response has an error field
            if (response && response.error) {
              throw new RpcException({
                status: response.status || 500,
                data: { error: response.error },
              });
            }

            // Return the response directly
            return response as UserAuthDto;
          }),
        ),
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUserAuth(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return firstValueFrom(
      this.client
        .send('user_auths.delete', {
          user_auth_id: id,
          reference_id: currentUser.companyId,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
          map((response) => {
            // Check if response has an error field
            if (response && response.error) {
              throw new RpcException({
                status: response.status || 500,
                data: { error: response.error },
              });
            }

            // Return the response directly
            return response as UserAuthDto;
          }),
        ),
    );
  }
}
