import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Auto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  serialNumber!: string;

  @Column()
  autoType!: string;

  @ManyToOne(() => User, (user) => user.autos)
  user!: User;
}
