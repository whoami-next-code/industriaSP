import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nombre!: string;

  @Column({ type: 'json' })
  datos!: any;

  @CreateDateColumn()
  creadoEn!: Date;
}

