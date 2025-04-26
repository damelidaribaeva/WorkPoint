import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CoworkingContext } from "../context/CoworkingContext";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setCToken } = useContext(CoworkingContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (role === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/coworking/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("cToken", data.token);
          setCToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 items-start m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg border-gray-200">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{role}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>

        {role === "Admin" ? (
          <p>
            Coworking Login?{" "}
            <span
              onClick={() => setRole("Coworking")}
              className="underline cursor-pointer text-primary"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setRole("Admin")}
              className="underline cursor-pointer text-primary"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
