import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CrearCompraDto {
  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  producto: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;
}

