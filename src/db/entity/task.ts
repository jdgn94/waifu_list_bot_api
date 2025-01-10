import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "tasks", comment: "Table to register task status" })
export class Task {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_tasks_id",
  })
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "boolean", nullable: false, default: false })
  complete: boolean;

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
