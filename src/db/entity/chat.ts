import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "chats", comment: "Chat table from telegram" })
export class Chat {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_chat_id",
  })
  id: Number;

  @Column({
    type: "int",
    name: "tg_id",
    unique: true,
    nullable: false,
  })
  tgId: Number;

  @Column({ type: "varchar", length: 20, name: "type", nullable: false })
  type: String;

  @Column({ type: "int", name: "limit_message", default: 100 })
  limitMessage: Number;

  @Column({ type: "boolean", name: "character_active", default: false })
  characterActive: Boolean;

  @Column({ type: "int", name: "limit_message_to_delete", default: 10 })
  limitMessageToDelete: Number;

  @Column({ type: "int", name: "message_count", default: 0 })
  messageCount: Number;

  @Column({ type: "int", name: "limit_message_count", default: 0 })
  limitMessageCount: Number;

  @Column({ type: "varchar", length: 4, name: "language", default: "en" })
  language: String;

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
}
