import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  // Ajouter un favori
  @Post(':productId')
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @Param('productId') productId: string,
    @Req() req: any,
  ) {
    return this.favoritesService.addFavorite(
      req.user.sub,
      Number(productId),
    );
  }

  // Récupérer les favoris
  @Get()
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Req() req: any) {
    return this.favoritesService.getFavorites(req.user.sub);
  }

  // Supprimer un favori
  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @Param('productId') productId: string,
    @Req() req: any,
  ) {
    return this.favoritesService.removeFavorite(
      req.user.sub,
      Number(productId),
    );
  }
}