import express from "express";
import {
  bookingsCoworking,
  cancelBookingCoworking,
  completeBooking,
  coworkingDashboard,
  coworkingList,
  coworkingProfile,
  loginCoworking,
  updateCoworkingProfile,
} from "../controllers/coworkingController.js";
import authCoworking from "../middlewares/authCoworking.js";

const coworkingRouter = express.Router();

coworkingRouter.get("/list", coworkingList);
coworkingRouter.post("/login", loginCoworking);
coworkingRouter.get("/bookings", authCoworking, bookingsCoworking);
coworkingRouter.post("/complete-booking", authCoworking, completeBooking);
coworkingRouter.post("/cancel-booking", authCoworking, cancelBookingCoworking);
coworkingRouter.get("/dashboard", authCoworking, coworkingDashboard);
coworkingRouter.get("/profile", authCoworking, coworkingProfile);
coworkingRouter.post("/update-profile", authCoworking, updateCoworkingProfile);

export default coworkingRouter;
