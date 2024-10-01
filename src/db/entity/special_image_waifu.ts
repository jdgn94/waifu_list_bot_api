import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SpecialImage } from "./special_image";
import { WaifuImage } from "./waifu_image";

@Entity({
  name: "special_image_waifus",
  comment: "Special Image Waifu from Special Images",
})
export class SpecialImageWaifu {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_special_image_waifus_id",
  })
  id: Number;

  @Column({ type: "int", name: "special_image_id", nullable: false })
  specialImageId: Number;

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

  @ManyToOne(() => SpecialImage, (specialImage) => specialImage.id)
  @JoinColumn({
    name: "special_image_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_special_image_waifu_special_image",
  })
  specialImage: SpecialImage;

  @ManyToOne(() => WaifuImage, (waifuImage) => waifuImage.id)
  @JoinColumn({
    name: "waifu_image",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_special_image_waifu_waifu_rarity",
  })
  waifuImage: WaifuImage;
}
