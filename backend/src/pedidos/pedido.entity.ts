import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column({ nullable: true })
  userId?: number;

  // Información del cliente
  @Column()
  customerName: string;

  @Column()
  customerDni: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  // Información del pedido
  @Column({ type: 'json' })
  items: string; // JSON string de los items

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shipping: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // Información de pago
  @Column({ default: 'CARD' })
  paymentMethod: 'CARD' | 'CASH_ON_DELIVERY';

  @Column({ default: 'PENDING' })
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

  @Column({ nullable: true })
  stripePaymentId?: string;

  // Estado del pedido
  @Column({ default: 'PENDING' })
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  // Dirección de envío
  @Column({ type: 'text' })
  shippingAddress: string;

  // Notas adicionales
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Mantener compatibilidad con el campo anterior
  @Column({ default: 'PENDIENTE' })
  status: 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'CANCELADO';
}

