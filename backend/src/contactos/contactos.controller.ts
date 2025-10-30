import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import type { CrearContactoDto, ActualizarEstadoDto } from './contactos.service';

@Controller('api/contactos')
export class ContactosController {
  constructor(private readonly service: ContactosService) {}

  @Post()
  crear(@Body() body: CrearContactoDto) {
    return this.service.crear(body);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Put(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body() body: ActualizarEstadoDto) {
    return this.service.actualizarEstado(Number(id), body);
  }
}
