import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('pedidos')
@Controller('api/pedidos')
export class PedidosController {
  constructor(private readonly service: PedidosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() body: any) {
    // Asegurar que el pedido se asocie al usuario autenticado
    const userId = req.user?.userId;
    const payload = { ...body, userId };
    return this.service.create(payload);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Pedidos del usuario autenticado
  @Get('mios')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: any) {
    const userId = req.user?.userId;
    return this.service.findByUserId(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','VENDEDOR')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // Nuevos endpoints para el sistema de ventas
  @Post('contra-entrega')
  @ApiOperation({ summary: 'Crear pedido con pago contra entrega' })
  @ApiResponse({ 
    status: 201, 
    description: 'Pedido creado exitosamente'
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createCashOnDeliveryOrder(@Body() createOrderDto: any) {
    try {
      const order = await this.service.createCashOnDeliveryOrder(createOrderDto);
      return {
        ok: true,
        message: 'Pedido creado exitosamente',
        orderId: order.id,
        orderNumber: order.orderNumber,
        order
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error creando el pedido'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('by-payment')
  @ApiOperation({ summary: 'Obtener pedido por ID de pago de Stripe' })
  @ApiQuery({ name: 'paymentId', description: 'ID del pago de Stripe' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedido encontrado'
  })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async getOrderByPayment(@Query('paymentId') paymentId: string) {
    try {
      const order = await this.service.getOrderByPaymentId(paymentId);
      if (!order) {
        throw new HttpException(
          {
            ok: false,
            error: 'Pedido no encontrado'
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        ok: true,
        order
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error obteniendo el pedido'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-order-id')
  @ApiOperation({ summary: 'Obtener pedido por ID de pedido' })
  @ApiQuery({ name: 'orderId', description: 'ID del pedido' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedido encontrado'
  })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async getOrderById(@Query('orderId') orderId: string) {
    try {
      const order = await this.service.getOrderById(orderId);
      if (!order) {
        throw new HttpException(
          {
            ok: false,
            error: 'Pedido no encontrado'
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        ok: true,
        order
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error obteniendo el pedido'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
