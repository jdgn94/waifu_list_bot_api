import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { SpecialImageWaifu } from "./special_image_waifu";

@Entity({ name: "special_images", comment: "Waifu special images from waifus" })
export class SpecialImage {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_special_images_id",
  })
  id: Number;

  @Column({ type: "int", name: "image", nullable: false })
  image: String;

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
    foreignKeyConstraintName: "fk_special_images_user",
  })
  user: User;

  @OneToMany(
    () => SpecialImageWaifu,
    (specialImageWaifu) => specialImageWaifu.specialImage
  )
  specialImageWaifus: SpecialImageWaifu[];
}
