import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll() {
    return this.productModel.findAll();
  }

  async create(productData: any) {
    return this.productModel.create(productData);
  }

  async remove(id: number) {
  const product = await this.productModel.findByPk(id);

  if (!product) {
    return { message: 'Produit introuvable' };
  }

  await product.destroy();

  return { message: 'Produit supprimé' };
}

async update(id: number, productData: any) {
  const product = await this.productModel.findByPk(id);

  if (!product) {
    return { message: 'Produit introuvable' };
  }

  await product.update(productData);

  return product;
}
}