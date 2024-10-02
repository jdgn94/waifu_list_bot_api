import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import { WaifuImage } from "./waifu_image";

@Entity({ name: "waifu_lists", comment: "Waifu List from users" })
@Unique("waifu_list_unique", ["userId", "waifuImageId"])
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
    width: 2,
    name: "quantity",
    unsigned: true,
    nullable: false,
    default: 1,
  })
  quantity: Number;

  @Column({ type: "int", name: "position", nullable: true })
  position: Number;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_lists_user_id",
  })
  user: User;

  @ManyToOne(() => WaifuImage, (waifuImage) => waifuImage.id)
  @JoinColumn({
    name: "waifu_image_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_lists_waifu_image_id",
  })
  waifuImage: WaifuImage;
}
