import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity.js';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite)
    private favoriteModel: typeof Favorite,
  ) {}

  async addFavorite(userId: number, productId: number) {
    const existingFavorite = await this.favoriteModel.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingFavorite) {
      return existingFavorite;
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