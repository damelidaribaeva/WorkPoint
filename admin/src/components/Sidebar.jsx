import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { CoworkingContext } from "../context/CoworkingContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { cToken } = useContext(CoworkingContext);

  return (
    <div className="min-h-screen bg-white border-r border-gray-200">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/all-bookings"}
          >
            <img src={assets.booking_icon} alt="" />
            <p className="hidden md:block">Bookings</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/add-coworking"}
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Coworking</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/coworking-list"}
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Coworkings List</p>
          </NavLink>
        </ul>
      )}
      {cToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/coworking-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/coworking-bookings"}
          >
            <img src={assets.booking_icon} alt="" />
            <p className="hidden md:block">Bookings</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/coworking-profile"}
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
