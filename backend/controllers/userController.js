import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "./../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import coworkingModel from "../models/coworkingModel.js";
import bookingModel from "../models/bookingModel.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password!" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: falses, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing!" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // Upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book coworking
const bookCoworking = async (req, res) => {
  try {
    const userId = req.userId;
    const { cowId, slotDate, slotTime } = req.body;
    console.log(cowId);

    const cowData = await coworkingModel.findById(cowId).select("-password");

    if (!cowData.available) {
      return res.json({
        success: false,
        message: "Coworking is not available for now",
      });
    }

    let slots_booked = cowData.slots_booked;

    // checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot is not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete cowData.slots_booked;

    const bookingData = {
      userId,
      cowId,
      userData,
      cowData,
      amount: cowData.fee,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newBooking = new bookingModel(bookingData);
    await newBooking.save();

    // save new slots data in coworkings data
    await coworkingModel.findByIdAndUpdate(cowId, { slots_booked });

    res.json({ success: true, message: "Coworking booked!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user bookings
const listBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await bookingModel.find({ userId });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel booking
const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);

    // Verify booking user
    if (bookingData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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

const payment = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.json({ success: false, message: "Booking ID is required" });
    }

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    booking.payment = true;
    await booking.save();

    res.json({
      success: true,
      message: "Payment marked as successful",
      booking,
    });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookCoworking,
  listBooking,
  cancelBooking,
  payment,
};
