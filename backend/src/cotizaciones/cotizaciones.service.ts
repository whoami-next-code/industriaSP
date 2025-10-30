import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from './cotizacion.entity';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly repo: Repository<Cotizacion>,
  ) {}

  create(data: Partial<Cotizacion>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Cotizacion>) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Cotización no encontrada');
    Object.assign(found, data);
    return this.repo.save(found);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Cotización no encontrada');
    return { deleted: true };
  }
}
