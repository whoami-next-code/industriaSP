import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async create(data: Partial<Categoria>): Promise<Categoria> {
    const cat = this.repo.create(data);
    return this.repo.save(cat);
  }

  async update(id: number, data: Partial<Categoria>): Promise<Categoria> {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new Error('Categoría no encontrada');
    Object.assign(found, data);
    return this.repo.save(found);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new Error('Categoría no encontrada');
    return { deleted: true };
  }
}
