import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import "dotenv/config";
import { ParkingHistory } from "./models/ParkingHistory";
import { ParkingZone } from "./models/ParkingZone";
import { Auto } from "./models/Auto";
import { ParkingReservation } from "./models/ParkingReservation";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: "car-parking",
  entities: [User, Auto, ParkingHistory, ParkingZone, ParkingReservation],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
});
