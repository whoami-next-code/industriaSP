import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './contacto.entity';
import { ContactosService } from './contactos.service';
import { ContactosController } from './contactos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  providers: [ContactosService],
  controllers: [ContactosController],
})
export class ContactosModule {}

