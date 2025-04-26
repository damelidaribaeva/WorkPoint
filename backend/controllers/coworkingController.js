import coworkingModel from "./../models/coworkingModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bookingModel from "../models/bookingModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { cowId } = req.body;

    const cowData = await coworkingModel.findById(cowId);
    await coworkingModel.findByIdAndUpdate(cowId, {
      available: !cowData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const coworkingList = async (req, res) => {
  try {
    const coworkings = await coworkingModel
      .find({})
      .select(["-password", "-email"]);
    res.json({ success: true, coworkings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for coworking login
const loginCoworking = async (req, res) => {
  try {
    const { email, password } = req.body;
    const coworking = await coworkingModel.findOne({ email });
    if (!coworking) {
      return res.json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const isMatch = await bcrypt.compare(password, coworking.password);
    if (isMatch) {
      const token = jwt.sign({ id: coworking._id }, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      return res.json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get coworking bookings for coworking panel
const bookingsCoworking = async (req, res) => {
  try {
    const cowId = req.cowId;
    const bookings = await bookingModel.find({ cowId });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark booking completed for coworking panel
const completeBooking = async (req, res) => {
  try {
    const cowId = req.cowId;
    const { bookingId } = req.body;
    const bookingData = await bookingModel.findById(bookingId);

    if (bookingData && bookingData.cowId === cowId) {
      await bookingModel.findByIdAndUpdate(bookingId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Booking marked as completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Marking as completed failed",
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel booking for coworking panel
const cancelBookingCoworking = async (req, res) => {
  try {
    const cowId = req.cowId;
    const { bookingId } = req.body;
    const bookingData = await bookingModel.findById(bookingId);

    if (bookingData && bookingData.cowId === cowId) {
      await bookingModel.findByIdAndUpdate(bookingId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Booking cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

const coworkingDashboard = async (req, res) => {
  try {
    const cowId = req.cowId;
    const bookings = await bookingModel.find({ cowId });

    let earnings = 0;
    bookings.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let clients = new Set();
    bookings.forEach((item) => {
      if (item.userId) {
        clients.add(item.userId.toString());
      }
    });

    const dashData = {
      earnings,
      bookings: bookings.length,
      clients: clients.size,
      latestBookings: bookings.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

const coworkingProfile = async (req, res) => {
  try {
    const cowId = req.cowId;
    const profileData = await coworkingModel
      .findById(cowId)
      .select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

const updateCoworkingProfile = async (req, res) => {
  try {
    const cowId = req.cowId;
    const { fee, address, available } = req.body;

    await coworkingModel.findByIdAndUpdate(cowId, {
      fee,
      address,
      available,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  coworkingList,
  loginCoworking,
  bookingsCoworking,
  completeBooking,
  cancelBookingCoworking,
  coworkingDashboard,
  coworkingProfile,
  updateCoworkingProfile,
};
