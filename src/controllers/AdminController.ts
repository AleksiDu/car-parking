import { Request, Response } from "express";
import { ParkingZone } from "../models/ParkingZone";
import { AppDataSource } from "../data-source";

export const createParkingZone = async (req: Request, res: Response) => {
  try {
    const { name, address, pricePerHour } = req.query;

    const parkingZoneRepository = AppDataSource.getRepository(ParkingZone);
    const parkingZone = parkingZoneRepository.create({
      name: name as string,
      address: address as string,
      pricePerHour: Number(pricePerHour),
    });

    await parkingZoneRepository.save(parkingZone);

    res.status(201).json(parkingZone);
  } catch (error) {
    console.error("Error creating parking zone:", error);
    res.status(500).send("Internal server error.");
  }
};

export const viewAllParkingZones = async (req: Request, res: Response) => {
  try {
    const parkingZoneRepository = AppDataSource.getRepository(ParkingZone);
    const parkingZones = await parkingZoneRepository.find();

    res.status(200).json(parkingZones);
  } catch (error) {
    console.error("Error viewing parking zones:", error);
    res.status(500).send("Internal server error.");
  }
};

export const viewParkingHistory = async (req: Request, res: Response) => {
  try {
    const { parkingZoneId } = req.params;

    const parkingZoneRepository = AppDataSource.getRepository(ParkingZone);

    const parkingZone = await parkingZoneRepository.findOneBy({
      id: Number(parkingZoneId),
    });

    if (!parkingZone) {
      res.status(404).send("Parking zone not found.");
      return;
    }

    const parkingHistory = parkingZone.parkingHistory;
    res.status(200).json(parkingHistory);
  } catch (error) {
    console.error("Error viewing parking history:", error);
    res.status(500).send("Internal server error.");
  }
};
