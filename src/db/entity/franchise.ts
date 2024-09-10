import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Waifu } from "./waifu";

@Entity({ name: "franchises", comment: "Franchise table from characters" })
export class Franchise {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_franchise_id",
  })
  id: Number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    name: "name",
  })
  name: String;

  @Column({
    type: "varchar",
    length: 255,
    name: "nickname",
    nullable: true,
    default: null,
  })
  nickname: String | null;

  @Column({
    type: "varchar",
    length: 255,
    name: "image",
    nullable: true,
    default: null,
  })
  image: String | null;

  @Column({
    type: "varchar",
    length: 255,
    name: "web_page",
    nullable: true,
    default: null,
  })
  webPage: String | null;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_franchises_user",
  })
  user: User;

  @OneToMany(() => Waifu, (waifu) => waifu.franchise)
  waifus: Waifu[];
}
