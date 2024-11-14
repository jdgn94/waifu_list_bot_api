import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "image_types", comment: "Image Types from waifu images" })
export class ImageType {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_image_types_id",
  })
  id: number;

  @Column({ type: "varchar", name: "name", nullable: false })
  name: string;

  @Column({ type: "varchar", name: "icon", nullable: true, default: true })
  icon: string | null;

  @Column({ type: "date", name: "initial_date", nullable: true })
  initialDate: Date | null;

  @Column({ type: "date", name: "final_date", nullable: true })
  finalDate: Date | null;

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
