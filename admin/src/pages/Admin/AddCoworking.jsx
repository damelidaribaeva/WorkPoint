import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCoworking = () => {
  const [cowImg, setCowImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("Private Office");
  const [capacity, setCapacity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!cowImg) {
        return toast.error("Image not selected!");
      }

      const formData = new FormData();

      formData.append("image", cowImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fee", Number(fee));
      formData.append("about", about);
      formData.append("type", type);
      formData.append("capacity", capacity);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // console log formData
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-coworking",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setCowImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setCapacity("");
        setAbout("");
        setFee("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Coworking</p>

      <div className="bg-white px-8 py-8 border border-gray-200 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="cow-img">
            <img
              className="w-16 h-16 bg-gray-100 object-cover rounded-full cursor-pointer"
              src={cowImg ? URL.createObjectURL(cowImg) : assets.upload_area}
              alt=""
            />
          </label>

          <input
            onChange={(e) => setCowImg(e.target.files[0])}
            type="file"
            id="cow-img"
            hidden
          />
          <p>
            Upload coworking <br /> image
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Coworking name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 border-gray-200"
                type="text"
                placeholder="Coworking name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Coworking email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 border-gray-200"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Coworking password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 border-gray-200"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2 border-gray-200"
                name=""
                id=""
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFee(e.target.value)}
                value={fee}
                className="border rounded px-3 py-2 border-gray-200"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Type</p>
              <select
                onChange={(e) => setType(e.target.value)}
                value={type}
                className="border rounded px-3 py-2 border-gray-200"
                name=""
                id=""
              >
                <option value="Private Office">Private Office</option>
                <option value="Shared Desk">Shared Desk</option>
                <option value="Meeting Room">Meeting Room</option>
                <option value="For Women">For Women</option>
                <option value="Open Lounge">Open Lounge</option>
                <option value="Podcast/Recording Studio">
                  Podcast/Recording Studio
                </option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Capacity</p>
              <input
                onChange={(e) => setCapacity(e.target.value)}
                value={capacity}
                className="border rounded px-3 py-2 border-gray-200"
                type="text"
                placeholder="Capacity"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 border-gray-200"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 border-gray-200"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About Coworking</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded border-gray-200"
            placeholder="Write about coworking"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded cursor-pointer"
        >
          Add Coworking
        </button>
      </div>
    </form>
  );
};

export default AddCoworking;
