import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Chat } from "./chat";
import { WaifuImage } from "./waifu_image";

@Entity({ name: "actives", comment: "Active waifus on chats" })
export class Active {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_actives_id",
  })
  id: Number;

  @Column({ type: "int", name: "chat_id", nullable: false, unique: true })
  chatId: Number;

  @Column({ type: "int", name: "waifu_image_id", nullable: false })
  waifuImageId: Number;

  @Column({ type: "int", name: "limit_message", nullable: false })
  limitMessage: Number;

  @Column({ type: "int", name: "message_count", default: 0 })
  messageCount: Number;

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

  @OneToOne(() => Chat, (chat) => chat.id)
  @JoinColumn({ name: "chat_id", referencedColumnName: "id" })
  chat: Chat;

  @OneToMany(() => WaifuImage, (waifuImage) => waifuImage.id)
  @JoinColumn({ name: "waifu_image_id", referencedColumnName: "id" })
  waifuImage: WaifuImage;
}
