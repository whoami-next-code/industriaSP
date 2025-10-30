import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min, ValidateNested } from 'class-validator';

class ItemDto {
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

export class CrearCompraMultipleDto {
  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

