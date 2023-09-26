import express from "express";
import {
  addAuto,
  editAuto,
  deleteAuto,
  reserveParking,
  endParkingReservation,
} from "../controllers/UserProfileController";

const router = express.Router();

router.post("/add-auto", addAuto);
router.put("/edit-auto/:id", editAuto);
router.delete("/delete-auto/:id", deleteAuto);
router.post("/reserve-parking", reserveParking);
router.put("/end-parking-reservation/:reservationId", endParkingReservation);

export default router;
