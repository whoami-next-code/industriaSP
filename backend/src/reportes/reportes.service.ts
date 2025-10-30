import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from './reporte.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private readonly repo: Repository<Reporte>,
  ) {}

  generarMuestreo() {
    // Datos de ejemplo: 24 puntos horarios con valores aleatorios controlados
    const now = Date.now();
    const puntos = Array.from({ length: 24 }).map((_, i) => ({
      t: new Date(now - (23 - i) * 60 * 60 * 1000).toISOString(),
      v: Math.round(50 + 30 * Math.sin(i / 3) + Math.random() * 10),
    }));
    return { puntos };
  }

  async guardar(nombre: string, datos: any) {
    const entity = this.repo.create({ nombre, datos });
    return await this.repo.save(entity);
  }

  async listar() {
    return await this.repo.find({ order: { creadoEn: 'DESC' } });
  }
}

