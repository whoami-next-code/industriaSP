import { Controller, Post, Get, Body, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ComprobantesService } from './comprobantes.service';
import type { ComprobanteData } from './comprobantes.service';

@ApiTags('comprobantes')
@Controller('api/comprobantes')
export class ComprobantesController {
  constructor(private readonly comprobantesService: ComprobantesService) {}

  @Post('generar')
  @ApiOperation({ summary: 'Generar comprobante electrónico (voucher/boleta)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Comprobante generado exitosamente'
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async generateComprobante(@Body() comprobanteData: ComprobanteData) {
    try {
      const comprobante = await this.comprobantesService.generateComprobante(comprobanteData);
      return {
        ok: true,
        message: 'Comprobante generado exitosamente',
        comprobante
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error generando el comprobante'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('consultar/:id')
  @ApiOperation({ summary: 'Consultar comprobante por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Comprobante encontrado'
  })
  @ApiResponse({ status: 404, description: 'Comprobante no encontrado' })
  async getComprobante(@Param('id') id: string) {
    try {
      const comprobante = await this.comprobantesService.getComprobante(id);
      if (!comprobante) {
        throw new HttpException(
          {
            ok: false,
            error: 'Comprobante no encontrado'
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        ok: true,
        comprobante
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error consultando el comprobante'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('verificar')
  @ApiOperation({ summary: 'Verificar autenticidad de comprobante' })
  @ApiQuery({ name: 'id', description: 'ID del comprobante' })
  @ApiQuery({ name: 'hash', description: 'Hash de seguridad' })
  @ApiResponse({ 
    status: 200, 
    description: 'Verificación completada'
  })
  async verifyComprobante(@Query('id') id: string, @Query('hash') hash: string) {
    try {
      const isValid = await this.comprobantesService.verifyComprobante(id, hash);
      return {
        ok: true,
        valid: isValid,
        message: isValid ? 'Comprobante válido' : 'Comprobante inválido'
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          error: error.message || 'Error verificando el comprobante'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
