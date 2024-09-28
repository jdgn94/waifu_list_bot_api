import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "waifu_lists", comment: "Waifu List from users" })
export class WaifuList {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_lists_id",
  })
  id: Number;

  @Column({ type: "int", name: "user_id", nullable: false })
  userId: Number;

  @Column({ type: "int", name: "waifu_image_id", nullable: false })
  waifuImageId: Number;

  @Column({
    type: "int",
    length: 2,
    name: "quantity",
    unsigned: true,
    nullable: false,
    default: 1,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  })
  quantity: Number;

  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "datetime",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
