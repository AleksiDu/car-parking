import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ParkingHistory } from "./ParkingHistory";

@Entity()
export class ParkingZone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  address!: string;

  @Column()
  pricePerHour!: number;

  @OneToMany(
    () => ParkingHistory,
    (parkingHistory) => parkingHistory.parkingZone
  )
  parkingHistory!: ParkingHistory[];
}
