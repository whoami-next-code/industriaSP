import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly repo: Repository<Pedido>,
  ) {}

  create(data: Partial<Pedido>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByUserId(userId: number) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Pedido>) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Pedido no encontrado');
    Object.assign(found, data);
    return this.repo.save(found);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Pedido no encontrado');
    return { deleted: true };
  }

  // Nuevos métodos para el sistema de ventas
  async createCashOnDeliveryOrder(orderData: any) {
    // Generar número de pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const orderEntity = this.repo.create({
      orderNumber,
      customerName: orderData.customerName,
      customerDni: orderData.customerDni,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: JSON.stringify(orderData.items),
      subtotal: orderData.subtotal,
      shipping: orderData.shipping || 0,
      total: orderData.total,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      notes: orderData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.repo.save(orderEntity);
  }

  async getOrderByPaymentId(paymentId: string) {
    return this.repo.findOne({
      where: { stripePaymentId: paymentId }
    });
  }

  async getOrderById(orderId: string) {
    // Intentar buscar por ID numérico primero
    if (!isNaN(Number(orderId))) {
      const orderById = await this.repo.findOneBy({ id: Number(orderId) });
      if (orderById) return orderById;
    }

    // Buscar por orderNumber si no es un ID numérico
    return this.repo.findOne({
      where: { orderNumber: orderId }
    });
  }

  async updateOrderStatus(orderId: number, status: Pedido['orderStatus'], paymentId?: string) {
    const order = await this.repo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    order.orderStatus = status;
    order.updatedAt = new Date();
    
    if (paymentId) {
      order.stripePaymentId = paymentId;
      order.paymentStatus = 'COMPLETED';
    }

    return this.repo.save(order);
  }
}
