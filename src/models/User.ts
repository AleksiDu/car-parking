import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Auto } from "./Auto";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "decimal", default: 100.0 })
  virtualBalance!: number;

  @Column({ nullable: true })
  resetToken?: string;

  @OneToMany(() => Auto, (auto) => auto.user)
  autos?: Auto[];
}
