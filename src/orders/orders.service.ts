import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/sequelize";

import { Order } from "./entities/order.entity.js";
import { OrderItem } from "./entities/order-item.entity.js";
import { CartItem } from "../cart/entity/cart-item.entity.js";
import { Product } from "../products/entities/product.entity.js";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,

    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,

    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
  ) {}

  async createOrder(
    userId: number,
    data: {
      nom: string;
      telephone: string;
      adresse: string;
      ville: string;
      paiement: string;
    },
  ) {
    const cartItems = await this.cartItemModel.findAll({
      where: { userId },
      include: [Product],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException(
        "Votre panier est vide",
      );
    }

    const total = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await this.orderModel.create({
      userId,

      // Informations de livraison
      nom: data.nom,
      telephone: data.telephone,
      adresse: data.adresse,
      ville: data.ville,

      // Mode de paiement
      paiement: data.paiement,

      total,
      status: "EN_ATTENTE",
    });

    for (const item of cartItems) {
      await this.orderItemModel.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Vider le panier après création de la commande
    await this.cartItemModel.destroy({
      where: { userId },
    });

    return {
      message: "Commande créée avec succès",
      order,
    };
  }

  async getMyOrders(userId: number) {
    const orders = await this.orderModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemModel.findAll({
          where: { orderId: order.id },
          include: [Product],
        });

        return {
          ...order.toJSON(),
          items,
        };
      }),
    );

    return ordersWithItems;
  }

  async getAllOrders() {
    const orders = await this.orderModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemModel.findAll({
          where: { orderId: order.id },
          include: [Product],
        });

        return {
          ...order.toJSON(),
          items,
        };
      }),
    );

    return ordersWithItems;
  }

  async updateStatus(
    orderId: number,
    status: string,
  ) {
    const order = await this.orderModel.findByPk(orderId);

    if (!order) {
      throw new BadRequestException(
        "Commande introuvable",
      );
    }

    const validStatuses = [
      "EN_ATTENTE",
      "CONFIRMEE",
      "EXPEDIEE",
      "LIVREE",
      "ANNULEE",
    ];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        "Statut invalide",
      );
    }

    order.status = status;

    await order.save();

    return {
      message:
        "Statut de la commande modifié avec succès",
      order,
    };
  }
}
