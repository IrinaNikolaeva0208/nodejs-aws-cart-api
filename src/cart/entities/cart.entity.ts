import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { CartItemEntity } from './cart-item.entity';
  import { CartStatus } from 'src/enums/cart-status.enum';
  
  @Entity('carts')
  export class CartEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;
  
    @Column({
      type: 'enum',
      enum: CartStatus,
      default: CartStatus.OPEN,
    })
    status: CartStatus;
  
    @OneToMany(() => CartItemEntity, (item) => item.cart, {
      cascade: true,
    })
    items: CartItemEntity[];
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
  }