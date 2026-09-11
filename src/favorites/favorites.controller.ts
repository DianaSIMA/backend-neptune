import { Body, Controller, Delete, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async addFavorite(
    @Body() body: { userId: number; productId: number },
  ) {
    return this.favoritesService.addFavorite(
      body.userId,
      body.productId,
    );
  }

  @Delete()
  async removeFavorite(
    @Body() body: { userId: number; productId: number },
  ) {
    return this.favoritesService.removeFavorite(
      body.userId,
      body.productId,
    );
  }
}