import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderPayload } from '../type';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  getAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  findById(orderId: string): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

  create(data: CreateOrderPayload): Promise<OrderEntity> {
    const order = this.orderRepository.create({
      userId: data.userId,
      cartId: data.cartId,
      delivery: data.address,
      comments: data.address?.comment ?? null,
      status: 'ORDERED',
      total: data.total,
    });

    return this.orderRepository.save(order);
  }

  async update(orderId: string, data: Partial<OrderEntity>): Promise<void> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.orderRepository.save({ ...order, ...data, id: orderId });
  }
}
