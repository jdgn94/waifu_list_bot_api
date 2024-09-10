import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Franchise } from "./franchise";
import { WaifuType } from "./waifu_type";
import { User } from "./user";

@Entity({ name: "waifus", comment: "Waifus table" })
export class Waifu {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_waifus_id",
  })
  id: Number;

  @Column({ type: "int", name: "franchise_id", nullable: false })
  franchiseId: Number;

  @Column({ type: "int", name: "type_id", nullable: false })
  typeId: Number;

  @Column({ type: "number", name: "user_id", nullable: true })
  userId: Number | null;

  @Column({ type: "varchar", length: 255, name: "name", nullable: false })
  name: String;

  @Column({ type: "varchar", length: 255, name: "nickname", nullable: true })
  nickname: String | null;

  @Column({ type: "int", name: "age", nullable: false, default: 0 })
  age: Number;

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

  @ManyToOne(() => Franchise, (franchise) => franchise.id)
  @JoinColumn({
    name: "franchise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifus_franchises",
  })
  franchise: Franchise;

  @ManyToOne(() => WaifuType, (waifuType) => waifuType.id)
  @JoinColumn({
    name: "type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifus_waifu_types",
  })
  waifuType: WaifuType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_waifus_users",
  })
  user: User;
}
