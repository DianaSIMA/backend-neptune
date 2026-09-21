import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";

import { OrdersService } from "./orders.service.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.createOrder(
      req.user.sub,
      body,
    );
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard)
  async getAllOrders(@Req() req: any) {
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException(
        "Accès réservé aux administrateurs",
      );
    }

    return this.ordersService.getAllOrders();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req: any) {
    return this.ordersService.getMyOrders(
      req.user.sub,
    );
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
    @Req() req: any,
  ) {
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException(
        "Accès réservé aux administrateurs",
      );
    }

    return this.ordersService.updateStatus(
      Number(id),
      status,
    );
  }
}
