import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseInterceptors, Param, Put, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { CategoriasService } from './categorias.service';
import { isValidPrice } from '../common/validation';

@Controller('api/categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Get()
  async list() {
    return this.service.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const { name, description } = body;
    if (!name || String(name).trim().length === 0) {
      throw new BadRequestException('El nombre es obligatorio');
    }

    let imageUrl: string | undefined = undefined;
    if (file) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const filename = `cat_${Date.now()}.webp`;
      const filepath = path.join(uploadsDir, filename);
      // Redimensiona a un ancho máximo de 800px
      await sharp(file.buffer).resize({ width: 800 }).webp({ quality: 85 }).toFile(filepath);
      imageUrl = `/uploads/categories/${filename}`;
    }

    const categoria = await this.service.create({ name: String(name).trim(), description, imageUrl });
    return categoria;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const { name, description } = body;
    if (name && String(name).trim().length === 0) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    let imageUrl: string | undefined = undefined;
    if (file) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const filename = `cat_${Date.now()}.webp`;
      const filepath = path.join(uploadsDir, filename);
      await sharp(file.buffer).resize({ width: 800 }).webp({ quality: 85 }).toFile(filepath);
      imageUrl = `/uploads/categories/${filename}`;
    }

    const data: any = {};
    if (name) data.name = String(name).trim();
    if (description !== undefined) data.description = description;
    if (imageUrl) data.imageUrl = imageUrl;
    const categoria = await this.service.update(Number(id), data);
    return categoria;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
