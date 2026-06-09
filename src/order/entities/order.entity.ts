import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('orders')
  export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;
  
    @Column({ name: 'cart_id', type: 'uuid' })
    cartId: string;
  
    @Column({ type: 'jsonb', nullable: true })
    payment: unknown;
  
    @Column({ type: 'jsonb', nullable: true })
    delivery: unknown;
  
    @Column({ type: 'text', nullable: true })
    comments: string | null;
  
    @Column({ type: 'text', default: 'ORDERED' })
    status: string;
  
    @Column({ type: 'numeric', default: 0 })
    total: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
  }