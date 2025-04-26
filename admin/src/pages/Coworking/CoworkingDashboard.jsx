import { useContext, useEffect } from "react";
import { assets } from "./../../assets/assets";
import { CoworkingContext } from "../../context/CoworkingContext";
import { AppContext } from "../../context/AppContext";

const CoworkingDashboard = () => {
  const { cToken, dashData, getDashData, completeBooking, cancelBooking } =
    useContext(CoworkingContext);

  const { currencySymbol, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (cToken) {
      getDashData();
    }
  }, [cToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currencySymbol} {dashData?.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.bookings_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData?.bookings}
              </p>
              <p className="text-gray-400">Bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.clients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData?.clients}
              </p>
              <p className="text-gray-400">Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-200">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0 border-gray-200">
            {dashData?.latestBookings?.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item?.userData?.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item?.userData?.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item?.slotDate)} | {item.slotTime}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelBooking(item?._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeBooking(item?._id)}
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
      </div>
    )
  );
};

export default CoworkingDashboard;
