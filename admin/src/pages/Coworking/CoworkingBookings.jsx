import React from "react";
import { useContext } from "react";
import { CoworkingContext } from "../../context/CoworkingContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "./../../assets/assets";

const CoworkingBookings = () => {
  const { cToken, bookings, getBookings, cancelBooking, completeBooking } =
    useContext(CoworkingContext);
  const { slotDateFormat, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (cToken) {
      getBookings();
    }
  }, [cToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Bookings</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll border-gray-200">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-200">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>phone</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {bookings.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 border-gray-200 py-3 px-6 border-b hover:bg-gray-50 "
            key={index}
          >
            <p className="max-sm:hidden ">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item?.userData.image}
                alt=""
              />
              <p>{item?.userData?.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden ">{item.userData.phone}</p>
            <p>
              {slotDateFormat(item.slotDate)} , {item.slotTime}
            </p>
            <p>
              {currencySymbol}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => cancelBooking(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeBooking(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoworkingBookings;
