import express from "express";
import {
  addAuto,
  editAuto,
  deleteAuto,
} from "../controllers/UserProfileController";

const router = express.Router();

router.post("/add-auto", addAuto);
router.put("/edit-auto/:id", editAuto);
router.delete("/delete-auto/:id", deleteAuto);

export default router;
