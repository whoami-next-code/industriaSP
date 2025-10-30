import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: { email: string; password: string; role?: UserRole; fullName?: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const entity = this.repo.create({
      email: data.email,
      passwordHash,
      role: data.role ?? UserRole.CLIENTE,
      fullName: data.fullName,
    });
    return this.repo.save(entity);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, data: Partial<User>) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Usuario no encontrado');
    if ((data as any).password) {
      (data as any).passwordHash = await bcrypt.hash((data as any).password, 10);
      delete (data as any).password;
    }
    Object.assign(found, data);
    return this.repo.save(found);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Usuario no encontrado');
    return { deleted: true };
  }
}
