import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  VirtualColumn,
} from "typeorm";
import { format } from "@formkit/tempo";
import { Role } from "./role";
import { UserInfo } from "./user_info";
import { Franchise } from "./franchise";

@Entity({ name: "users", comment: "User table" })
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_user_id",
  })
  id: Number;

  @Column({
    type: "int",
    unique: true,
    name: "tg_id",
    nullable: false,
  })
  tgId: Number;

  @Column({ type: "varchar", length: 64, name: "username" })
  username: String;

  @Column({ type: "varchar", length: 64, name: "nickname" })
  nickname: String;

  @Column({ type: "int", name: "role_id", nullable: false, default: 3 })
  roleId: Number;

  @Column({ type: "int", name: "info_id", nullable: true })
  infoId: Number;

  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
    transformer: {
      from: (value: Date) => value,
      to: (value: Date) => format(value, "DD/MM/YYYY HH:mm:ss, Z"),
    },
  })
  createdAt: Date;

  @Column({
    type: "datetime",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    transformer: {
      from: (value: Date) => value,
      to: (value: Date) => format(value, "DD/MM/YYYY HH:mm:ss, Z"),
    },
  })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "info_id", referencedColumnName: "id" })
  userInfo: UserInfo;

  @OneToMany(() => Franchise, (franchise) => franchise.user)
  franchises: Franchise[];

  @VirtualColumn({
    type: "int",
    query: (alias: String) =>
      `SELECT COUNT(*) AS count FROM franchises WHERE user_id = ${alias}.id`,
  })
  franchiseCount: Number;
}
