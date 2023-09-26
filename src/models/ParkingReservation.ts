import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Auto } from "./Auto";
import { ParkingZone } from "./ParkingZone";

@Entity()
export class ParkingReservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Auto)
  @JoinColumn()
  auto!: Auto;

  @ManyToOne(() => ParkingZone)
  @JoinColumn()
  parkingZone!: ParkingZone;

  @CreateDateColumn()
  reservationTime!: Date;

  @UpdateDateColumn()
  endTime?: Date;
}
