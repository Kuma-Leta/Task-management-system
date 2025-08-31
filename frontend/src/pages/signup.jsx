// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api_url from "../utils/constant";
const PRIMARY_COLOR = "#801A1A";
const SECONDARY_COLOR = "#F6C026";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      await axios.post(`${api_url}/api/v1/auth/register`, formData);

      // Save the email in local storage for auto-filling in the login page
      localStorage.setItem("userEmail", formData.email);

      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { backgroundColor: PRIMARY_COLOR, color: "#fff" },
      });
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setErrorMessage("Error signing up. Please try again.");
      toast.error(
        error?.response?.data?.message || "Error signing up. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { backgroundColor: PRIMARY_COLOR, color: "#fff" },
        }
      );
      console.log(error);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        style={{ borderTop: `6px solid ${PRIMARY_COLOR}` }}
      >
        <h2
          className="text-2xl font-semibold mb-4 text-center"
          style={{ color: PRIMARY_COLOR }}
        >
          Create an Account
        </h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-md font-semibold transition-colors duration-200"
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: "#fff",
              border: `2px solid ${PRIMARY_COLOR}`,
            }}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold"
            style={{ color: PRIMARY_COLOR }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
