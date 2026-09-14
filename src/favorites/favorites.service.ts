import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Favorite } from './favorite.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite)
    private favoriteModel: typeof Favorite,

    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async addFavorite(userId: number, productId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'id ${userId} introuvable`,
      );
    }
    const product = await this.productModel.findByPk(productId);

    if (!product) {
      throw new NotFoundException(`Produit avec l'id ${productId} introuvable`);
    }

    const existingFavorite = await this.favoriteModel.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (existingFavorite) {
      throw new ConflictException('Ce produit est déjà dans vos favoris');
    }

    return this.favoriteModel.create({
      userId,
      productId,
    });
  }

  async removeFavorite(userId: number, productId: number) {
    const favorite = await this.favoriteModel.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!favorite) {
      return { message: 'Favori introuvable' };
    }

    await favorite.destroy();

    return { message: 'Favori supprimé' };
  }
}
