import { Module } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './cotizacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cotizacion])],
  providers: [CotizacionesService],
  controllers: [CotizacionesController]
})
export class CotizacionesModule {}
