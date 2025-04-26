import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const CoworkingContext = createContext();

const CoworkingContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cToken, setCToken] = useState(
    localStorage.getItem("cToken") ? localStorage.getItem("cToken") : ""
  );
  const [bookings, setBookings] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [profileData, setProfileData] = useState(false);

  const getBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/coworking/bookings", {
        headers: { cToken },
      });

      if (data.success) {
        setBookings(data.bookings.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const completeBooking = async (bookingId) => {
    console.log("coworkingId:", bookingId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/coworking/complete-booking",
        { bookingId },
        { headers: { cToken } }
      );
      console.log("data:", data);
      if (data.success) {
        console.log("data:", data);
        getBookings();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/coworking/cancel-booking",
        { bookingId },
        { headers: { cToken } }
      );
      if (data.success) {
        getBookings();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/coworking/dashboard",
        {
          headers: { cToken },
        }
      );

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message || "Failed to fetch dashboard data.");
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/coworking/profile", {
        headers: { cToken },
      });

      if (data.success) {
        setProfileData(data.profileData);
        console.log("data:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message || "Failed to fetch profile data.");
    }
  };

  const value = {
    cToken,
    setCToken,
    backendUrl,
    getBookings,
    bookings,
    setBookings,
    completeBooking,
    cancelBooking,
    getDashData,
    dashData,
    setDashData,
    getProfileData,
    profileData,
    setProfileData,
  };

  return (
    <CoworkingContext.Provider value={value}>
      {props.children}
    </CoworkingContext.Provider>
  );
};

export default CoworkingContextProvider;
