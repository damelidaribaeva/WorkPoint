import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllBookings from "./pages/Admin/AllBookings";
import AddCoworking from "./pages/Admin/AddCoworking";
import CoworkingsList from "./pages/Admin/CoworkingsList";
import { CoworkingContext } from "./context/CoworkingContext";
import CoworkingDashboard from "./pages/Coworking/CoworkingDashboard";
import CoworkingBookings from "./pages/Coworking/CoworkingBookings";
import CoworkingProfile from "./pages/Coworking/CoworkingProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { cToken } = useContext(CoworkingContext);
  return aToken || cToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/add-coworking" element={<AddCoworking />} />
          <Route path="/coworking-list" element={<CoworkingsList />} />

          {/* Coworking Route */}
          <Route path="/coworking-dashboard" element={<CoworkingDashboard />} />
          <Route path="/coworking-bookings" element={<CoworkingBookings />} />
          <Route path="/coworking-profile" element={<CoworkingProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
