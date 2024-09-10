import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ImageType } from "./image_type";
import { WaifuSpecialFranchise } from "./waifus_special_franchise";
import { WaifuSpecialWaifu } from "./waifu_special_waifu";
import { User } from "./user";

@Entity({
  name: "waifu_special_images",
  comment: "Waifu Special Images table from waifus",
})
export class WaifuSpecialImage {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_special_images_id",
  })
  id: Number;

  @Column({ type: "int", name: "image_type_id", nullable: false })
  imageTypeId: Number;

  @Column({ type: "int", name: "public_id", nullable: false })
  publicId: Number;

  @Column({ type: "int", name: "public_url", nullable: false })
  publicUrl: Number;

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

  @ManyToOne(() => ImageType, (imageType) => imageType.id)
  @JoinColumn({
    name: "image_type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_images_image_types",
  })
  imageType: ImageType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifu_special_images_users",
  })
  user: User | null;

  @OneToMany(
    () => WaifuSpecialFranchise,
    (waifuSpecialFranchise) => waifuSpecialFranchise.waifuSpecialImage
  )
  waifuSpecialFranchises: WaifuSpecialFranchise[];

  @OneToMany(
    () => WaifuSpecialWaifu,
    (waifuSpecialWaifu) => waifuSpecialWaifu.waifuSpecialImage
  )
  waifuSpecialWaifus: WaifuSpecialWaifu[];
}
