import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Waifu } from "./waifu";
import { ImageType } from "./image_type";
import { User } from "./user";
import { WaifuRarity } from "./waifu_rarity";

@Entity({ name: "waifu_images", comment: "Waifu images from waifus" })
@Unique("waifu_image_unique", ["waifuId", "ImageTypeId"])
export class WaifuImage {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_images_id",
  })
  id: number;

  @Column({ type: "int", name: "waifu_id", nullable: false })
  waifuId: number;

  @Column({ type: "int", name: "rarity_id", nullable: false })
  rarityId: number;

  @Column({ type: "int", name: "user_id", nullable: true, default: null })
  userId: number | null;

  @Column({ type: "int", name: "image_type_id", nullable: false })
  ImageTypeId: number;

  @Column({ type: "int", name: "points", nullable: false })
  points: number;

  @Column({ type: "varchar", name: "public_id", nullable: false })
  publicId: string;

  @Column({ type: "varchar", name: "public_url", nullable: false })
  publicUrl: string;

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

  @ManyToOne(() => Waifu, (waifu) => waifu.id)
  @JoinColumn({
    name: "waifu_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_images_waifu",
  })
  waifu: Waifu;

  @ManyToOne(() => WaifuRarity, (rarity) => rarity.id)
  @JoinColumn({
    name: "rarity_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_images_waifu_rarity",
  })
  waifuRarity: WaifuRarity;

  @ManyToOne(() => ImageType, (imageType) => imageType.id)
  @JoinColumn({
    name: "image_type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_images_image_type",
  })
  imageType: ImageType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_images_user",
  })
  user: User;
}
