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

@Table({
  tableName: "orders",
})
export class Order extends Model {
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

  // Nom du client pour la livraison
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nom: string;

  // Téléphone du client
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare telephone: string;

  // Adresse de livraison
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare adresse: string;

  // Ville de livraison
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare ville: string;

  // Mode de paiement
  @Column({
    type: DataType.ENUM(
      "WAVE",
      "ORANGE_MONEY",
      "LIVRAISON",
    ),
    allowNull: true,
  })
  declare paiement: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare total: number;

  @Column({
    type: DataType.ENUM(
      "EN_ATTENTE",
      "CONFIRMEE",
      "EXPEDIEE",
      "LIVREE",
      "ANNULEE",
    ),
    defaultValue: "EN_ATTENTE",
  })
  declare status: string;
}
