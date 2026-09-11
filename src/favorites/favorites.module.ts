import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity.js';
import { FavoritesService } from './favorites.service.js';
import { FavoritesController } from './favorites.controller.js';

@Module({
    imports: [
  SequelizeModule.forFeature([Favorite]),
],
    providers: [FavoritesService],
    controllers: [FavoritesController],
})
export class FavoritesModule {}
