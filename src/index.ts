import express from "express";
import { User } from "./entities/User";
import { AppDataSource } from "./data-source";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ error: "Username is already taken" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, async () => {
  try {
    await AppDataSource.initialize()
      .then(() => {
        console.log("Connected to PostgreSQL database");
      })
      .catch((error) => console.error("Database connection error", error));
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});
