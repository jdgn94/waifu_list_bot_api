import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "roles", comment: "Role table" })
export class Role {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_role_id",
  })
  id: Number;

  @Column({ type: "varchar", length: 64, unique: true, nullable: false })
  name: String;

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
