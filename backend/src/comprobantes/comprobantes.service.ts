import { Injectable } from '@nestjs/common';

export interface ComprobanteData {
  orderNumber: string;
  customerName: string;
  customerDni: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'CARD' | 'CASH_ON_DELIVERY';
  paymentStatus: string;
  orderDate: Date;
  notes?: string;
}

export interface ComprobanteResponse {
  id: string;
  type: 'VOUCHER' | 'BOLETA';
  orderNumber: string;
  issueDate: Date;
  customerInfo: {
    name: string;
    document: string;
    documentType: 'DNI' | 'RUC';
    email?: string;
    phone?: string;
  };
  companyInfo: {
    name: string;
    ruc: string;
    address: string;
    phone: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  paymentInfo: {
    method: string;
    status: string;
  };
  qrCode?: string;
  hash: string;
}

@Injectable()
export class ComprobantesService {
  private readonly companyInfo = {
    name: 'IndustriaSP',
    ruc: '20123456789',
    address: 'Av. Industrial 123, Lima, Perú',
    phone: '+51 1 234-5678',
    email: 'ventas@industriasp.com'
  };

  async generateComprobante(orderData: ComprobanteData): Promise<ComprobanteResponse> {
    // Determinar tipo de comprobante basado en el DNI/RUC
    const documentType = this.getDocumentType(orderData.customerDni);
    const comprobanteType = documentType === 'RUC' ? 'BOLETA' : 'VOUCHER';

    // Generar ID único para el comprobante
    const comprobanteId = this.generateComprobanteId(comprobanteType);

    // Generar hash de seguridad
    const hash = this.generateSecurityHash(orderData, comprobanteId);

    // Preparar información del cliente
    const customerInfo = {
      name: orderData.customerName,
      document: orderData.customerDni,
      documentType,
      email: orderData.customerEmail,
      phone: orderData.customerPhone
    };

    // Preparar items del comprobante
    const items = orderData.items.map(item => ({
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.total
    }));

    // Preparar totales
    const totals = {
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total
    };

    // Preparar información de pago
    const paymentInfo = {
      method: orderData.paymentMethod === 'CARD' ? 'Tarjeta de Crédito/Débito' : 'Pago Contra Entrega',
      status: this.getPaymentStatusText(orderData.paymentStatus)
    };

    // Generar código QR (simulado)
    const qrCode = this.generateQRCode(comprobanteId, hash);

    const comprobante: ComprobanteResponse = {
      id: comprobanteId,
      type: comprobanteType,
      orderNumber: orderData.orderNumber,
      issueDate: new Date(),
      customerInfo,
      companyInfo: this.companyInfo,
      items,
      totals,
      paymentInfo,
      qrCode,
      hash
    };

    return comprobante;
  }

  private getDocumentType(document: string): 'DNI' | 'RUC' {
    // RUC tiene 11 dígitos, DNI tiene 8
    return document.length === 11 ? 'RUC' : 'DNI';
  }

  private generateComprobanteId(type: 'VOUCHER' | 'BOLETA'): string {
    const prefix = type === 'BOLETA' ? 'B001' : 'V001';
    const number = Math.floor(Math.random() * 999999) + 1;
    return `${prefix}-${number.toString().padStart(6, '0')}`;
  }

  private generateSecurityHash(orderData: ComprobanteData, comprobanteId: string): string {
    const dataToHash = `${comprobanteId}${orderData.orderNumber}${orderData.total}${orderData.customerDni}`;
    // En producción, usar una librería de hash real como crypto
    return Buffer.from(dataToHash).toString('base64').substring(0, 16);
  }

  private generateQRCode(comprobanteId: string, hash: string): string {
    // En producción, generar un QR real que apunte a la verificación del comprobante
    const qrData = `https://industriasp.com/verify/${comprobanteId}?hash=${hash}`;
    return `data:image/svg+xml;base64,${Buffer.from(this.generateQRSVG(qrData)).toString('base64')}`;
  }

  private generateQRSVG(data: string): string {
    // SVG simple simulando un código QR
    return `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="black" stroke-width="2"/>
        <rect x="20" y="20" width="10" height="10" fill="black"/>
        <rect x="40" y="20" width="10" height="10" fill="black"/>
        <rect x="60" y="20" width="10" height="10" fill="black"/>
        <rect x="20" y="40" width="10" height="10" fill="black"/>
        <rect x="60" y="40" width="10" height="10" fill="black"/>
        <rect x="20" y="60" width="10" height="10" fill="black"/>
        <rect x="40" y="60" width="10" height="10" fill="black"/>
        <rect x="60" y="60" width="10" height="10" fill="black"/>
        <text x="50" y="95" text-anchor="middle" font-size="8" fill="black">QR Code</text>
      </svg>
    `;
  }

  private getPaymentStatusText(status: string): string {
    // Map tipado para evitar TS7053 (no index signature)
    const statusMap: Record<string, string> = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completado',
      FAILED: 'Fallido',
      REFUNDED: 'Reembolsado',
    };
    return statusMap[status] ?? status;
  }

  async getComprobante(comprobanteId: string): Promise<ComprobanteResponse | null> {
    // En producción, esto consultaría la base de datos
    // Por ahora retornamos null para simular que no existe
    return null;
  }

  async verifyComprobante(comprobanteId: string, hash: string): Promise<boolean> {
    // En producción, esto verificaría el hash contra la base de datos
    // Por ahora retornamos true para simular verificación exitosa
    return true;
  }
}
