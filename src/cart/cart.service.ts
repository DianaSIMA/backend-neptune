import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/sequelize";

import { Product } from "../products/entities/product.entity.js";
import { CartItem } from "./entity/cart-item.entity.js";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,

    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async addToCart(
    userId: number,
    productId: number,
    quantity: number = 1,
  ) {
    const product = await this.productModel.findByPk(productId);

    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }

    const existingItem = await this.cartItemModel.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      existingItem.quantity += quantity;

      await existingItem.save();

      return existingItem;
    }

    return this.cartItemModel.create({
      userId,
      productId,
      quantity,
    });
  }

  async getCart(userId: number) {
    return this.cartItemModel.findAll({
      where: { userId },
      include: [Product],
    });
  }

  async updateQuantity(
    userId: number,
    productId: number,
    quantity: number,
  ) {
    const item = await this.cartItemModel.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        "Produit absent du panier",
      );
    }

    if (quantity <= 0) {
      await item.destroy();

      return {
        message: "Produit supprimé du panier",
      };
    }

    item.quantity = quantity;

    await item.save();

    return item;
  }

  async removeFromCart(
    userId: number,
    productId: number,
  ) {
    const item = await this.cartItemModel.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        "Produit absent du panier",
      );
    }

    await item.destroy();

    return {
      message: "Produit supprimé du panier",
    };
  }
}