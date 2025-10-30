import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearIntentoDto } from './dto/crear-intento.dto';

@Controller('api/pagos')
export class PagosController {
  constructor(private readonly pagos: PagosService) {}

  @Post('intento')
  async crearIntento(@Body() body: CrearIntentoDto) {
    return this.pagos.crearIntento(body);
  }

  // Webhook de Stripe: debe recibir el cuerpo RAW para verificación de firma.
  // En Nest, para habilitar body raw, se requiere configurar el middleware en main.ts.
  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') signature?: string) {
    // req.rawBody está disponible si se configura correctamente el middleware raw.
    const rawBody: Buffer = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    return this.pagos.manejarWebhook(rawBody, signature);
  }
}

