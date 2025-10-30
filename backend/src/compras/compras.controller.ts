import { Controller, Post, Body } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { CrearCompraMultipleDto } from './dto/crear-compra-multiple.dto';

@Controller('api/compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async crearCompra(@Body() dto: CrearCompraDto) {
    return this.comprasService.crearCompra(dto);
  }

  @Post('multiples')
  async crearCompraMultiple(@Body() dto: CrearCompraMultipleDto) {
    return this.comprasService.crearCompraMultiple(dto);
  }
}
