import { useContext, useEffect, useState } from "react";
import { CoworkingContext } from "../../context/CoworkingContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const CoworkingProfile = () => {
  const { cToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(CoworkingContext);
  const { currencySymbol } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (cToken) {
      getProfileData();
    }
  }, [cToken]);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fee: profileData.fee,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/coworking/update-profile",
        updateData,
        { headers: { ctoken: cToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error?.message);
    }
  };

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p className="text-3xl font-medium text-gray-600">
              {profileData.name}
            </p>

            <div className="mt-3">
              <p className="text-sm font-medium text-neutral-800">About:</p>
              <p className="text-sm text-gray-600 mt-1">{profileData.about}</p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Booking Fee:{" "}
              <span className="text-gray-800">
                {currencySymbol}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fee: e.target.value,
                      }))
                    }
                    value={profileData.fee}
                  />
                ) : (
                  profileData.fee
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData?.address?.line1}
                  />
                ) : (
                  profileData.address?.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData?.address?.line2}
                  />
                ) : (
                  profileData.address?.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default CoworkingProfile;
