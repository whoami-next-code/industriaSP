import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quotes')
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column({ type: 'json' })
  items: { productId: number; quantity: number }[];

  @Column({ default: 'PENDIENTE' })
  status: 'PENDIENTE' | 'EN_PROCESO' | 'ENVIADA' | 'CERRADA';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}

