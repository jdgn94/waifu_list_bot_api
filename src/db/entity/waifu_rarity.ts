import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WaifuImage } from "./waifu_image";

@Entity({ name: "waifu_rarities", comment: "Waifu rarities from waifus" })
export class WaifuRarity {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_rarities_id",
  })
  id: number;

  @Column({ type: "varchar", name: "name", nullable: false, unique: true })
  name: string;

  @Column({ type: "varchar", name: "icon", nullable: false })
  icon: string;

  @Column({ type: "int", name: "cost", nullable: false })
  cost: number;

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

  @OneToMany(() => WaifuImage, (waifuImage) => waifuImage.waifuRarity)
  waifuImages: WaifuImage[];
}
