import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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

  async findOne(id: number) {
  const product = await this.productModel.findByPk(id);

  if (!product) {
    throw new NotFoundException('Produit introuvable.');
  }

  return product;
}

  async create(productData: any) {
    // Vérifier si un produit avec le même nom existe déjà
    const existingProduct = await this.productModel.findOne({
      where: {
        name: productData.name,
      },
    });

    if (existingProduct) {
      throw new ConflictException('Un produit avec ce nom existe déjà.');
    }

    // Vérifier que le prix est valide
    if (productData.price <= 0) {
      throw new BadRequestException(
        'Le prix du produit doit être supérieur à 0.',
      );
    }

    return this.productModel.create(productData);
  }

  // =========================
  // MODIFIER UN PRODUIT
  // =========================
  async update(id: number, productData: any) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException('Produit introuvable.');
    }

    // Si le nom est modifié, vérifier qu'il n'existe
    // pas déjà un autre produit avec ce nom
    if (productData.name) {
      const existingProduct = await this.productModel.findOne({
        where: {
          name: productData.name,
        },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException(
          'Un autre produit avec ce nom existe déjà.',
        );
      }
    }

    // Vérifier le prix
    if (productData.price !== undefined && productData.price <= 0) {
      throw new BadRequestException(
        'Le prix du produit doit être supérieur à 0.',
      );
    }

    await product.update(productData);

    return product;
  }

  // =========================
  // SUPPRIMER UN PRODUIT
  // =========================
  async remove(id: number) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(
        'Produit introuvable.',
      );
    }

    await product.destroy();

    return {
      message: 'Produit supprimé avec succès.',
    };
  }
}
