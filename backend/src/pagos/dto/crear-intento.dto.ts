import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsNumber()
  @Min(0)
  precioUnitario!: number;

  @IsInt()
  @Min(1)
  cantidad!: number;
}

export class CrearIntentoDto {
  @IsString()
  @IsNotEmpty()
  ruc!: string; // Campo obligatorio (requisito del usuario)

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items!: ItemDto[];

  @IsOptional()
  @IsString()
  email?: string;
}

