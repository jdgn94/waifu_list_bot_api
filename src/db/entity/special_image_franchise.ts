import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "special_image_franchises",
  comment: "Special Image Franchises from Special Images",
})
export class SpecialImageFranchise {
  @PrimaryGeneratedColumn({
    type: "int",
    primaryKeyConstraintName: "pk_special_image_franchises_id",
  })
  id: number;

  @Column({ type: "int", name: "special_image_id", nullable: false })
  specialImageId: number;

  @Column({ type: "int", name: "franchise_id", nullable: false })
  franchiseId: number;

  @Column({ type: "int", name: "user_id", nullable: true, default: null })
  userId: number | null;

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
