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
import { Role } from "./role";
import { UserInfo } from "./user_info";
import { Franchise } from "./franchise";

@Entity({ name: "users", comment: "User table" })
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_user_id",
  })
  id: number;

  @Column({
    type: "int",
    unique: true,
    name: "tg_id",
    nullable: false,
  })
  tgId: number;

  @Column({ type: "varchar", length: 64, name: "username" })
  username: string;

  @Column({ type: "varchar", length: 64, name: "nickname" })
  nickname: string;

  @Column({ type: "int", name: "role_id", nullable: false, default: 3 })
  roleId: number;

  @Column({ type: "int", name: "info_id", nullable: true })
  infoId: number;

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
    query: (alias: string) =>
      `SELECT COUNT(*) AS count FROM franchises WHERE user_id = ${alias}.id`,
  })
  franchiseCount: number;
}
