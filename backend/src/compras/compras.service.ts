import { Injectable } from '@nestjs/common';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { obtenerDatosPorDNI } from '../common/utils/reniec-api';
import { CrearCompraMultipleDto } from './dto/crear-compra-multiple.dto';

@Injectable()
export class ComprasService {
  async crearCompra(dto: CrearCompraDto) {
    const datos = await obtenerDatosPorDNI(dto.dni);

    const total = Number(dto.precioUnitario) * Number(dto.cantidad);

    const boleta = {
      numero: `BOL-${Date.now()}`,
      cliente: {
        dni: dto.dni,
        nombre: `${datos.nombres} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`.trim(),
      },
      producto: dto.producto,
      cantidad: Number(dto.cantidad),
      precioUnitario: Number(dto.precioUnitario),
      total,
      fecha: new Date(),
    };

    // Comprobante de pago ficticio
    const comprobante = {
      transaccionId: `TX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      metodo: 'Tarjeta (simulado)',
      estado: 'PAGADO',
      monto: total,
      moneda: 'PEN',
      emitidoEn: new Date(),
    };

    return { mensaje: 'Compra registrada exitosamente', boleta, comprobante };
  }

  async crearCompraMultiple(dto: CrearCompraMultipleDto) {
    const datos = await obtenerDatosPorDNI(dto.dni);
    const items = (dto.items ?? []).map((it) => ({
      producto: it.producto,
      cantidad: Number(it.cantidad),
      precioUnitario: Number(it.precioUnitario),
      subtotal: Number(it.cantidad) * Number(it.precioUnitario),
    }));
    const total = items.reduce((acc, it) => acc + it.subtotal, 0);

    const boleta = {
      numero: `BOL-${Date.now()}`,
      cliente: {
        dni: dto.dni,
        nombre: `${datos.nombres} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`.trim(),
      },
      items,
      total,
      fecha: new Date(),
    };

    const comprobante = {
      transaccionId: `TX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      metodo: 'Tarjeta (simulado)',
      estado: 'PAGADO',
      monto: total,
      moneda: 'PEN',
      emitidoEn: new Date(),
    };

    return { mensaje: 'Compra registrada exitosamente', boleta, comprobante };
  }
}
