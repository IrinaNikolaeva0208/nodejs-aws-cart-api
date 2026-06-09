import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartStatus } from 'src/enums/cart-status.enum';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  private toModel(entity: CartEntity): Cart {
    return {
      id: entity.id,
      user_id: entity.userId,
      created_at: entity.createdAt ? entity.createdAt.getTime() : Date.now(),
      updated_at: entity.updatedAt ? entity.updatedAt.getTime() : Date.now(),
      status: entity.status as unknown as CartStatuses,
      items: (entity.items ?? []).map((item) => ({
        product: {
          id: item.productId,
          title: '',
          description: '',
          price: 0,
        },
        count: item.count,
      })),
    };
  }

  private findOpenCartEntity(userId: string): Promise<CartEntity | null> {
    return this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items'],
    });
  }

  private createCartEntity(userId: string): Promise<CartEntity> {
    const cart = this.cartRepository.create({
      userId,
      status: CartStatus.OPEN,
      items: [],
    });

    return this.cartRepository.save(cart);
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.findOpenCartEntity(userId);

    return cart ? this.toModel(cart) : null;
  }

  async createByUserId(userId: string): Promise<Cart> {
    return this.toModel(await this.createCartEntity(userId));
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);

    return cart ?? this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload): Promise<Cart> {
    const cart =
      (await this.findOpenCartEntity(userId)) ??
      (await this.createCartEntity(userId));

    const { product, count } = payload;
    const index = (cart.items ?? []).findIndex(
      (item) => item.productId === product.id,
    );

    if (count <= 0) {
      if (index !== -1) {
        await this.cartItemRepository.delete({
          cartId: cart.id,
          productId: product.id,
        });
      }
    } else if (index === -1) {
      await this.cartItemRepository.save(
        this.cartItemRepository.create({
          cartId: cart.id,
          productId: product.id,
          count,
        }),
      );
    } else {
      await this.cartItemRepository.update(
        { cartId: cart.id, productId: product.id },
        { count },
      );
    }

    return this.toModel(await this.findOpenCartEntity(userId));
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.findOpenCartEntity(userId);

    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  async closeByUserId(userId: string): Promise<void> {
    const cart = await this.findOpenCartEntity(userId);

    if (cart) {
      cart.status = CartStatus.ORDERED;
      await this.cartRepository.save(cart);
    }
  }
}
