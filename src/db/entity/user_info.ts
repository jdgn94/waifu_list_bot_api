import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "user_infos", comment: "User info table from users" })
export class UserInfo {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_user_info_id",
  })
  id: number;

  @Column({ type: "int", name: "user_id", nullable: false, unique: true })
  userId: number;

  @Column({ type: "int", name: "level", default: 1 })
  level: number;

  @Column({ type: "int", name: "exp", default: 0 })
  exp: number;

  @Column({ type: "int", name: "limit_exp", default: 100 })
  limitExp: number;

  @Column({ type: "int", name: "coins", default: 0 })
  coins: number;

  @Column({ type: "int", name: "diamonds", default: 0 })
  diamonds: number;

  @Column({ type: "int", name: "golden_tickets", default: 0 })
  goldenTickets: number;

  @Column({ type: "int", name: "favorite_pages", default: 1 })
  favoritePages: number;

  @Column({ type: "int", name: "favorite_page_purchases", default: 0 })
  favoritePagePurchases: number;

  @Column({ type: "boolean", name: "login_daily", default: 0 })
  loginDaily: boolean;

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

  @OneToOne(() => User)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_user_info_user",
  })
  user: User;
}
