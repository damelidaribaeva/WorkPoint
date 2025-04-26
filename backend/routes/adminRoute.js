import express from "express";
import {
  addCoworking,
  adminDashboard,
  allCoworkings,
  bookingCancel,
  bookingsAdmin,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/coworkingController.js";

const adminRouter = express.Router();

adminRouter.post(
  "/add-coworking",
  authAdmin,
  upload.single("image"),
  addCoworking
);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-coworkings", authAdmin, allCoworkings);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/bookings", authAdmin, bookingsAdmin);
adminRouter.post("/cancel-booking", authAdmin, bookingCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
