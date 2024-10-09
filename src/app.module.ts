import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    NatsModule,
    AccountModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
