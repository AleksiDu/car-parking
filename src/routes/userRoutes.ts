import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  requestPasswordReset,
} from "../controllers/UserController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
