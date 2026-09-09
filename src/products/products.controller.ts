import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.services.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() productData: any) {
    return this.productsService.create(productData);
  }

  @Delete(':id')
remove(@Param('id') id: string) {
  return this.productsService.remove(Number(id));
}

@Put(':id')
update(@Param('id') id: string, @Body() productData: any) {
  return this.productsService.update(Number(id), productData);
}
}