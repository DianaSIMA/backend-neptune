import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./orders.service.js";

import { Order } from "./entities/order.entity.js";
import { OrderItem } from "./entities/order-item.entity.js";

import { User } from "../users/entities/user.entity.js";
import { Product } from "../products/entities/product.entity.js";

import { AuthModule } from "../auth/auth.module.js";
import { CartItem } from "../cart/entity/cart-item.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      OrderItem,
      User,
      Product,
       CartItem,
    ]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}