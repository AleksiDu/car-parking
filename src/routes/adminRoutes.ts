import express from "express";
import {
  createParkingZone,
  viewAllParkingZones,
  viewParkingHistory,
} from "../controllers/AdminController";

const router = express.Router();

router.post("/create-parking-zone", createParkingZone);
router.get("/view-all-parking-zones", viewAllParkingZones);
router.get("/view-parking-history", viewParkingHistory);

export default router;
