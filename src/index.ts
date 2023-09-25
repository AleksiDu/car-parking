import express from "express";
import { AppDataSource } from "./data-source";
import "dotenv/config";

import userRoutes from "./routes/userRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
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
