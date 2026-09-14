import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity.js';
import { FavoritesService } from './favorites.service.js';
import { FavoritesController } from './favorites.controller.js';
import { User } from '../users/entities/user.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([Favorite, User, Product])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
