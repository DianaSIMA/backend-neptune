import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { CartController } from "./cart.controller.js";
import { CartService } from "./cart.service.js";
import { User } from "../users/entities/user.entity.js";
import { Product } from "../products/entities/product.entity.js";
import { AuthModule } from "../auth/auth.module.js";
import { CartItem } from "./entity/cart-item.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      CartItem,
      User,
      Product,
    ]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}