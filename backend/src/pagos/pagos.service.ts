import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { CrearIntentoDto } from './dto/crear-intento.dto';
import { obtenerDatosPorRUC, validarRUC } from '../common/utils/ruc';

@Injectable()
export class PagosService {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new Stripe(key, { apiVersion: '2024-09-30' as any });
  }

  /**
   * Crea un PaymentIntent en Stripe usando Automatic Payment Methods.
   * - Valida RUC y obtiene razón social desde SUNAT (o fallback).
   * - Calcula el monto total (en céntimos) a partir de los items.
   */
  async crearIntento(body: CrearIntentoDto) {
    if (!validarRUC(body.ruc)) {
      return { ok: false, error: 'RUC inválido' };
    }

    const datosRUC = await obtenerDatosPorRUC(body.ruc);
    if (!datosRUC) {
      return { ok: false, error: 'No se encontraron datos para el RUC' };
    }

    const amount = Math.round(
      (body.items || []).reduce((s, it) => s + Number(it.precioUnitario) * Number(it.cantidad), 0) * 100
    );

    if (!amount || amount < 1) {
      return { ok: false, error: 'El monto calculado es inválido' };
    }

    // Crear PaymentIntent
    const pi = await this.stripe.paymentIntents.create({
      amount,
      currency: 'pen',
      automatic_payment_methods: { enabled: true },
      metadata: {
        ruc: datosRUC.ruc,
        razonSocial: datosRUC.razonSocial,
        direccion: datosRUC.direccion || '',
        items: JSON.stringify(body.items ?? []),
      },
    });

    // Factura (generación básica inmediata para visualización; en producción usar webhook y persistencia)
    const factura = {
      tipo: 'FACTURA',
      ruc: datosRUC.ruc,
      razonSocial: datosRUC.razonSocial,
      direccion: datosRUC.direccion,
      fecha: new Date().toISOString(),
      items: body.items,
      total: amount / 100,
      moneda: 'PEN',
      paymentIntentId: pi.id,
    };

    return { ok: true, clientSecret: pi.client_secret, paymentIntentId: pi.id, factura, datosRUC };
  }

  async manejarWebhook(rawBody: Buffer, signature: string | undefined) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!endpointSecret) {
      // Si no hay secreto configurado, aceptar el evento sin verificación (solo entorno dev)
      console.warn('STRIPE_WEBHOOK_SECRET no configurado, omitiendo verificación');
      try {
        const payload = JSON.parse(rawBody.toString('utf8'));
        return this._procesarEvento(payload);
      } catch (e) {
        return { ok: false, error: 'Payload inválido' };
      }
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature || '', endpointSecret);
    } catch (err: any) {
      console.error('Error verificando webhook:', err?.message || err);
      return { ok: false, error: 'Firma de webhook inválida' };
    }

    return this._procesarEvento(event);
  }

  private async _procesarEvento(event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data?.object as Stripe.PaymentIntent;
        console.log('Pago confirmado:', pi.id, pi.amount, pi.currency);
        // Aquí se podría persistir la orden y marcarla como pagada
        return { ok: true };
      }
      default:
        return { ok: true }; // ignorar otros eventos
    }
  }
}

