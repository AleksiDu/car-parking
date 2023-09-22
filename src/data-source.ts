import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: "car-parking",
  entities: [User],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
});
