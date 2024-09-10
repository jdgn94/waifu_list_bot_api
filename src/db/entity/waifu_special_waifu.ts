import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { WaifuSpecialImage } from "./waifu_special_image";
import { User } from "./user";
import { WaifuImage } from "./waifu_image";

@Entity({
  name: "waifu_special_waifus",
  comment: "Waifu Special Waifus from Waifu Special",
})
@Unique("waifu_special_waifu_unique", ["waifuSpecialImageId", "waifuImageId"])
export class WaifuSpecialWaifu {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_special_waifus_id",
  })
  id: Number;

  @Column({ type: "int", name: "waifu_special_image_id", nullable: false })
  waifuSpecialImageId: Number;

  @Column({ type: "int", name: "waifu_image_id", nullable: false })
  waifuImageId: Number;

  @Column({ type: "int", name: "user_id", nullable: true, default: null })
  userId: Number | null;

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

  @ManyToOne(
    () => WaifuSpecialImage,
    (waifuSpecialImage) => waifuSpecialImage.id
  )
  @JoinColumn({
    name: "waifu_special_image_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_waifus_waifu_special_images",
  })
  waifuSpecialImage: WaifuSpecialImage;

  @ManyToOne(() => WaifuImage, (waifuImage) => waifuImage.id)
  @JoinColumn({
    name: "waifu_image_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_waifus_waifus",
  })
  waifuImage: WaifuImage;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_waifus_users",
  })
  user: User | null;
}
