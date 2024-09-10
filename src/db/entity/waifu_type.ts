import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Waifu } from "./waifu";

@Entity({ name: "waifu_types", comment: "Waifu types from waifus" })
export class WaifuType {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifu_types_id",
  })
  id: Number;

  @Column({ type: "varchar", name: "name", nullable: false })
  name: String;

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

  @OneToMany(() => Waifu, (waifu) => waifu.waifuType)
  waifus: Waifu[];
}
