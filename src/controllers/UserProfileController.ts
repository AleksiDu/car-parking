import { ParkingZone } from "./../models/ParkingZone";
import { AppDataSource } from "./../data-source";
import { Request, Response } from "express";
import { User } from "../models/User";
import { Auto } from "../models/Auto";
import { ParkingReservation } from "../models/ParkingReservation";
import { ParkingHistory } from "../models/ParkingHistory";

export const addAuto = async (req: Request, res: Response) => {
  try {
    const { name, serialNumber, autoType } = req.query;

    const userId = 2; // 1,2,3

    const userRepository = AppDataSource.getRepository(User);
    const autoRepository = AppDataSource.getRepository(Auto);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auto = autoRepository.create({
      name: name as string,
      serialNumber: serialNumber as string,
      autoType: autoType as string,
      user,
    });

    console.log(auto);

    await autoRepository.manager.save(auto);

    res.status(201).send("Auto details added successfully.");
  } catch (error) {
    console.error("Error adding auto details:", error);
    res.status(500).send("Internal server error.");
  }
};

export const editAuto = async (req: Request, res: Response) => {
  try {
    const { id, name, serialNumber, autoType } = req.query;
    const userRepository = AppDataSource.getRepository(User);
    const autoRepository = AppDataSource.getRepository(Auto);
    const userId = 2;

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const [auto] = await autoRepository.find({
      where: {
        id: Number(id),
      },
      relations: {
        user: true,
      },
    });

    if (!auto) {
      return res.status(404).json({ message: "Auto not found" });
    }

    if (auto.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You have not permission to change" });
    }

    auto.name = name as string;
    auto.serialNumber = serialNumber as string;
    auto.autoType = autoType as string;

    await autoRepository.save(auto);
    res.status(200).send("Auto details edited successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
};

export const deleteAuto = async (req: Request, res: Response) => {
  try {
    const userId = 2;
    const autoId = req.query.autoId;

    const autoRepository = AppDataSource.getRepository(Auto);
    const [auto] = await autoRepository.find({
      where: {
        id: Number(autoId),
      },
      relations: {
        user: true,
      },
    });

    if (!auto) {
      return res.status(404).json({ message: "Auto not found." });
    }

    if (auto.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this auto." });
    }
    await autoRepository.remove(auto);

    res.status(200).send("Auto details deleted successfully.");
  } catch (error) {
    console.error("Error deleting auto details:", error);
    res.status(500).send("Internal server error.");
  }
};

export const reserveParking = async (req: Request, res: Response) => {
  try {
    const { userId, autoId, parkingZoneId } = req.query;

    const parkingZoneRepository = AppDataSource.getRepository(ParkingZone);

    const parkingZone = await parkingZoneRepository.findOneBy({
      id: Number(parkingZoneId),
    });

    if (!parkingZone) {
      return res
        .status(404)
        .json({ message: "This Parking Zone does not exist" });
    }

    const parkingReservationRepository =
      AppDataSource.getRepository(ParkingReservation);

    const parkingReservation = parkingReservationRepository.create({
      user: { id: Number(userId) },
      auto: { id: Number(autoId) },
      parkingZone: { id: Number(parkingZoneId) },
      reservationTime: new Date(),
    });
    await parkingReservationRepository.save(parkingReservation);
    res.status(201).json({
      message: "Parkin reserved successfully.",
      reservation: parkingReservation,
    });
  } catch (error) {
    console.error("Error reserving parking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const endParkingReservation = async (req: Request, res: Response) => {
  const calculateParkingCharge = async (
    durationInHours: number,
    pricePerHour: number
  ): Promise<number> => {
    return durationInHours * pricePerHour;
  };

  try {
    const { reservationId } = req.params;

    const parkingReservationRepository =
      AppDataSource.getRepository(ParkingReservation);
    const parkingHistoryRepository =
      AppDataSource.getRepository(ParkingHistory);
    const parkingZoneRepository = AppDataSource.getRepository(ParkingZone);
    const userRepository = AppDataSource.getRepository(User);

    const [reservation] = await parkingReservationRepository.find({
      where: {
        id: Number(reservationId),
      },
      relations: {
        user: true,
        parkingZone: true,
      },
    });
    if (reservation) {
      reservation.endTime = new Date();
      await parkingReservationRepository.save(reservation);

      const parkingHistory = parkingHistoryRepository.create({
        userId: Number(reservation.user.id),
        parkingZoneId: Number(reservation.parkingZone.id),
        parkingZone: reservation.parkingZone,
        startTime: reservation.reservationTime,
        endTime: reservation.endTime || new Date(),
      });

      const durationInHours = Math.round(
        (reservation.endTime.getTime() -
          reservation.reservationTime.getTime()) /
          (1000 * 60 * 60)
      );

      const parkingZone = await parkingZoneRepository.findOneBy({
        id: Number(reservation.parkingZone.id),
      });

      if (!parkingZone) {
        res.status(404).json({ message: "Associated parking zone not found." });
        return;
      }

      const parkingCharge = await calculateParkingCharge(
        durationInHours,
        parkingZone.pricePerHour
      );

      const user = await userRepository.findOneBy({
        id: Number(reservation.user.id),
      });

      if (!user) {
        res.status(404).json({ message: "Associated user not found." });
        return;
      }

      if (user.virtualBalance < parkingCharge) {
        res.status(403).json({ message: "Insufficient virtual balance." });
        return;
      }

      user.virtualBalance -= parkingCharge;

      await userRepository.save(user);
      await parkingHistoryRepository.save(parkingHistory);

      res
        .status(200)
        .json({ message: "Parking reservation ended successfully." });
    }
  } catch (error) {
    console.error("Error ending parking reservation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
