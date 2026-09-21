import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { User } from "../../users/entities/user.entity.js";
import { Product } from "../../products/entities/product.entity.js";

@Table({
  tableName: "cart_items",
})
export class CartItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare quantity: number;
}