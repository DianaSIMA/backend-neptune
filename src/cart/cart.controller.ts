import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { CartService } from "./cart.service.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("cart")
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Post(":productId")
  @UseGuards(JwtAuthGuard)
  async addToCart(
    @Param("productId") productId: string,
    @Body("quantity") quantity: number,
    @Req() req: any,
  ) {
    return this.cartService.addToCart(
      req.user.sub,
      Number(productId),
      Number(quantity) || 1,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.sub);
  }

  @Patch(":productId")
  @UseGuards(JwtAuthGuard)
  async updateQuantity(
    @Param("productId") productId: string,
    @Body("quantity") quantity: number,
    @Req() req: any,
  ) {
    return this.cartService.updateQuantity(
      req.user.sub,
      Number(productId),
      Number(quantity),
    );
  }

  @Delete(":productId")
  @UseGuards(JwtAuthGuard)
  async removeFromCart(
    @Param("productId") productId: string,
    @Req() req: any,
  ) {
    return this.cartService.removeFromCart(
      req.user.sub,
      Number(productId),
    );
  }
}