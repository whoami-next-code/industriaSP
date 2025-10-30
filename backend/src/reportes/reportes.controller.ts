import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('api/reportes')
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  @Get('muestreo')
  muestreo() {
    return this.service.generarMuestreo();
  }

  @Post('guardar')
  guardar(@Body() body: { nombre: string; datos: any }) {
    return this.service.guardar(body.nombre, body.datos);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
}

