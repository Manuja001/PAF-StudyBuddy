import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/background.jpeg";
import email from "../assets/email.png";
import password from "../assets/password.png";
import user from "../assets/user.png";
import showPasswordIcon from "../assets/showPassword.png";
import hidePasswordIcon from "../assets/hidePassword.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log(formData);
    const dataToSubmit = {
      ...formData,
      role: "User",
      bio: "Hi I am " + formData.firstName + " " + formData.lastName,
    };
    console.log("formDate: ", dataToSubmit);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/register",
        dataToSubmit
      );
      if (response.status === 200) {
        toast.success("Registration successful!");
        //redirect to login or home page
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle the error message from the backend
        const errorMessage =
          error.response.data.message || "Registration failed.";
        if (errorMessage.includes("User already exists")) {
          toast.error("Email already exists. Please use a different email.");
        }
      } else {
        console.error("Error during registration:", error);
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="bg-slate-200 w-full items-center flex justify-center lg:w-1/2">
        <div className="bg-white px-10 py-10 w-96 rounded-3xl mt-10 mb-10">
          <div>
            <h1>
              <span className="font-semibold text-slate-800 text-5xl">
                Welcome{" "}
              </span>{" "}
            </h1>
            <p className="font-medium mt-6 text-slate-600 text-lg">
              Enter your details below!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <div>
              <label className="font-medium text-base ml-10 ">First Name</label>
              <div className="flex items-center justify-center">
                <img
                  src={user}
                  alt="user"
                  className="w-6 h-6 inline-block mr-3"
                />
                <input
                  className="w-full bg-transparent border-2 px-2 py-1 mt-1 border-slate-300 rounded-xl"
                  type="text"
                  id="firstName"
                  placeholder="Enter your First Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="font-medium text-base ml-10 ">Last Name</label>
              <div className="flex items-center justify-center">
                <img
                  src={user}
                  alt="user"
                  className="w-6 h-6 inline-block mr-3"
                />
                <input
                  className="w-full bg-transparent border-2 px-2 py-1 mt-1 border-slate-300 rounded-xl"
                  type="text"
                  id="lastName"
                  placeholder="Enter your Last Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="font-medium text-base ml-10 " htmlFor="email">
                Email
              </label>
              <div className="flex items-center justify-center">
                <img
                  src={email}
                  alt="email"
                  className="w-6 h-6 inline-block mr-3"
                />
                <input
                  className="w-full bg-transparent border-2 px-2 py-1 mt-1 border-slate-300 rounded-xl"
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="font-medium text-base ml-10" htmlFor="password">
                Password
              </label>
              <div className="flex items-center justify-center mt-1">
                <img
                  src={password}
                  alt="password"
                  className="w-6 h-6 inline-block mr-3"
                />
                <div className="relative w-full">
                  <input
                    className="w-full bg-transparent border-2 px-2 py-1 border-slate-300 rounded-xl pr-10"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <img
                      src={showPassword ? hidePasswordIcon : showPasswordIcon}
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
            <input
              type="hidden"
              id="role"
              value="User"
              onChange={handleChange}
            />
            <div className=" flex justify-between items-center"></div>
            <p className="mt-5 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-500 cursor-pointer">
                Login
              </Link>
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-slate-500 text-white uppercase text-lg font-semibold px-5 py-3 rounded-3xl mt-7 hover:scale-[1.02] ease-in-out active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
            <div className="flex items-center justify-center mt-5">
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorization/google")
                }
                className="text-sm uppercase border-2 px-4 py-2 text-slate-800 border-slate-300 rounded-xl hover:scale-[1.02] ease-in-out active:scale-[0.98]"
              >
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center w-1/2">
        <img
          src={background}
          alt="background"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Register;
