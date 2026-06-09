import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './cart/entities/cart.entity';
import { CartItemEntity } from './cart/entities/cart-item.entity';
import { OrderEntity } from './order/entities/order.entity';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    AuthModule, 
    CartModule,
    OrderModule, 
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [CartEntity, CartItemEntity, OrderEntity, UserEntity],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
