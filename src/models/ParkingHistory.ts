import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ParkingZone } from "./ParkingZone";

@Entity()
export class ParkingHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  parkingZoneId!: number;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @ManyToOne(() => ParkingZone, (parkingZone) => parkingZone.parkingHistory)
  @JoinColumn({ name: "parking_zone_id" })
  parkingZone!: ParkingZone;
}
