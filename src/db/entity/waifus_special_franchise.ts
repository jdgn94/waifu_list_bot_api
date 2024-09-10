import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { WaifuSpecialImage } from "./waifu_special_image";
import { Franchise } from "./franchise";
import { User } from "./user";

@Entity({
  name: "waifu_special_franchises",
  comment: "Waifu Special Franchises from Waifu Special Images",
})
export class WaifuSpecialFranchise {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_special_franchises_id",
  })
  id: Number;

  @Column({ type: "int", name: "waifu_special_image_id", nullable: false })
  waifuSpecialImageId: Number;

  @Column({ type: "int", name: "franchise_id", nullable: false })
  franchiseId: Number;

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
    foreignKeyConstraintName:
      "fk_waifu_special_franchises_waifu_special_images",
  })
  waifuSpecialImage: WaifuSpecialImage;

  @ManyToOne(() => Franchise, (franchise) => franchise.id)
  @JoinColumn({
    name: "franchise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_franchises_franchises",
  })
  franchise: Franchise;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_franchises_users",
  })
  user: User | null;
}
