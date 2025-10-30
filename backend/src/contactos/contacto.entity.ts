import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contactos')
export class Contacto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nombre!: string;

  @Column({ length: 160 })
  email!: string;

  @Column({ length: 30, nullable: true })
  telefono?: string;

  @Column({ type: 'text' })
  mensaje!: string;

  @Column({ type: 'int', nullable: true })
  productoId?: number;

  @Column({ length: 20, default: 'nuevo' })
  estado!: 'nuevo' | 'en_proceso' | 'atendido' | 'cancelado';

  @CreateDateColumn()
  creadoEn!: Date;
}

