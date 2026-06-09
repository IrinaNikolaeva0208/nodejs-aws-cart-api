import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { OrderService } from '../order';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { OrderEntity } from '../order/entities/order.entity';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        OrderService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CartItemEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
