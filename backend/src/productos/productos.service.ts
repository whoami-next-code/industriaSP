import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  create(data: Partial<Product>) {
    const entity = this.productRepo.create(data);
    return this.productRepo.save(entity);
  }

  findAll(query?: { q?: string; category?: string }) {
    const where: any = {};
    if (query?.q) where.name = ILike(`%${query.q}%`);
    if (query?.category) where.category = query.category;
    return this.productRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Product>) {
    const found = await this.productRepo.findOneBy({ id });
    if (!found) throw new NotFoundException('Producto no encontrado');
    Object.assign(found, data);
    return this.productRepo.save(found);
  }

  async remove(id: number) {
    const res = await this.productRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Producto no encontrado');
    return { deleted: true };
  }
}
