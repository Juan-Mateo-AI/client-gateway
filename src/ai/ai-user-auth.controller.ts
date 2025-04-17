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

  @Post('')
  @UseGuards(AuthGuard)
  async createUserAuth(@User() currentUser: CurrentUser, @Body() userAuthToCreate: UserAuthDto) {
    try {
      console.log(`Sending create user auth request for companyId: ${currentUser.companyId}`);
      const response = await firstValueFrom(
        this.client
          .send('user_auth.create', {
            ...userAuthToCreate,
            reference_id: currentUser.companyId,
          })
          .pipe(
            catchError((error) => {
              console.error('Error in createUserAuth:', error);
              throw new RpcException(error);
            }),
            map((response) => {
              console.log('Received response:', response);
              // Check if response has an error field
              if (response && response.error) {
                throw new RpcException({
                  status: response.status || 500,
                  data: { error: response.error },
                });
              }

              // Return the response directly
              return response;
            }),
          ),
      );

      console.log('Final response:', response);
      return response;
    } catch (error) {
      console.error('Exception in createUserAuth:', error);
      throw error;
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUserAuth(
    @User() currentUser: CurrentUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return firstValueFrom(
      this.client
        .send('user_auth.get_by_id', {
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
            return response;
          }),
        ),
    );
  }

  @Get('')
  @UseGuards(AuthGuard)
  async getUserAuths(@User() currentUser: CurrentUser, @Query('referenceId') referenceId: string) {
    return firstValueFrom(
      this.client
        .send('user_auth.get_by_ref_id', {
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
            return response;
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
        .send('user_auth.update', {
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
            return response;
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
        .send('user_auth.delete', {
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
            return response;
          }),
        ),
    );
  }
}
