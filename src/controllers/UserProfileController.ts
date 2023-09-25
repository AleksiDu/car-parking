import { AppDataSource } from "./../data-source";
import { Request, Response } from "express";
import { User } from "../models/User";
import { Auto } from "../models/Auto";

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
