import { AppDataSource } from "./../data-source";
import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ParkingReservation } from "../models/ParkingReservation";

const JWT_SECRET = process.env.JWT_SECRET;
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.query;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({
      username: username as string,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = userRepository.create({
      username: username as string,
      password: hashedPassword,
      createdDate: new Date(),
      updatedDate: new Date(),
    });

    await userRepository.save(user);

    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.query;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      username: username as string,
    });

    if (!user) {
      return res.status(400).json({ message: "User dose not exists" });
    }

    if (user.resetToken) {
      return res
        .status(403)
        .json({ message: "Password reset in progress. Cannot log in." });
    }

    const passwordMatch = await bcrypt.compare(
      password as string,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (JWT_SECRET) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: "Invalid Token" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      username: username as string,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist." });
    }

    if (JWT_SECRET) {
      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("rest token is ===>>>", resetToken);
      user.resetToken = resetToken;

      await userRepository.save(user);

      res
        .status(200)
        .json({ message: "Password reset token generated successfully." });
    } else {
      return res.status(400).json({ message: "Invalid Token" });
    }
  } catch (error) {
    console.error("Error generating reset token:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.query;

    if (
      (typeof resetToken !== "string" && String(resetToken).length <= 0) ||
      typeof JWT_SECRET !== "string"
    ) {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    const decodedToken: any = jwt.verify(resetToken as string, JWT_SECRET);

    if (!decodedToken.userId) {
      return res.status(400).json({ message: "Invalid reset token" });
    }
    const userId = decodedToken.userId;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(400).json({ message: "User dose not exists" });
    }

    const hashedPassword = await bcrypt.hash(newPassword as string, 10);
    user.password = hashedPassword;
    user.resetToken = "";

    await userRepository.save(user);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error." });
  }
};
