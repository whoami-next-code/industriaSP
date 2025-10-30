import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './contacto.entity';

export interface CrearContactoDto {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  productoId?: number;
}

export interface ActualizarEstadoDto {
  estado: 'nuevo' | 'en_proceso' | 'atendido' | 'cancelado';
}

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private readonly repo: Repository<Contacto>,
  ) {}

  async crear(dto: CrearContactoDto): Promise<Contacto> {
    const entity = this.repo.create({ ...dto, estado: 'nuevo' });
    return await this.repo.save(entity);
  }

  async listar(): Promise<Contacto[]> {
    return await this.repo.find({ order: { creadoEn: 'DESC' } });
  }

  async actualizarEstado(id: number, dto: ActualizarEstadoDto): Promise<Contacto | null> {
    const contacto = await this.repo.findOne({ where: { id } });
    if (!contacto) return null;
    contacto.estado = dto.estado;
    return await this.repo.save(contacto);
  }
}

