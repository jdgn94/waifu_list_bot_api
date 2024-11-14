import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "chats", comment: "Chat table from telegram" })
export class Chat {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_chat_id",
  })
  id: number;

  @Column({
    type: "int",
    name: "tg_id",
    unique: true,
    nullable: false,
  })
  tgId: number;

  @Column({ type: "varchar", length: 20, name: "type", nullable: false })
  type: string;

  @Column({ type: "int", name: "limit_message", default: 100 })
  limitMessage: number;

  @Column({ type: "boolean", name: "character_active", default: false })
  characterActive: boolean;

  @Column({ type: "int", name: "limit_message_to_delete", default: 10 })
  limitMessageToDelete: number;

  @Column({ type: "int", name: "message_count", default: 0 })
  messageCount: number;

  @Column({ type: "int", name: "limit_message_count", default: 0 })
  limitMessageCount: number;

  @Column({ type: "varchar", length: 4, name: "language", default: "en" })
  language: string;

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
