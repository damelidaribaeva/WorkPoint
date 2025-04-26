import validator from "validator";
import bcrypt, { hash } from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import coworkingModel from "./../models/coworkingModel.js";
import jwt from "jsonwebtoken";
import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";

// API for adding coworking
const addCoworking = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      type,
      capacity,
      experience,
      about,
      fee,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add coworkings
    if (
      !name ||
      !email ||
      !password ||
      !type ||
      !capacity ||
      !experience ||
      !about ||
      !fee ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validating Strong Password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing coworking password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    const coworkingData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      type,
      capacity,
      experience,
      about,
      fee,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newCoworking = new coworkingModel(coworkingData);
    await newCoworking.save();

    res.json({ success: true, message: "Coworking added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all coworkings list
const allCoworkings = async (req, res) => {
  try {
    const coworkings = await coworkingModel.find({}).select("-password");
    res.json({ success: true, coworkings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all coworkings list
const bookingsAdmin = async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for bookings cancellation
const bookingCancel = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);

    await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });

    // Releasing coworking's slot
    const { cowId, slotDate, slotTime } = bookingData;

    const coworkingData = await coworkingModel.findById(cowId);
    let slots_booked = coworkingData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await coworkingModel.findByIdAndUpdate(cowId, { slots_booked });
    res.json({ success: true, message: "Booking cancelled!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const coworkings = await coworkingModel.find({});
    const users = await userModel.find({});
    const bookings = await bookingModel.find({});

    const dashData = {
      coworkings: coworkings.length,
      bookings: bookings.length,
      clients: users.length,
      latestBookings: bookings.reverse().slice(0 - 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addCoworking,
  loginAdmin,
  allCoworkings,
  bookingsAdmin,
  bookingCancel,
  adminDashboard,
};
