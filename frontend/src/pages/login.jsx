import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens
import { toast } from "react-toastify";
import api_url from "../utils/constant";

const PRIMARY_COLOR = "#801A1A";
const SECONDARY_COLOR = "#F6C026";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Auto-fill email from local storage if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: savedEmail, // Set email from local storage
      }));
    }
  }, []);

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
      const response = await axios.post(
        `${api_url}/api/v1/auth/login`,
        formData
      );

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token); // Save token

      // Decode the token to extract user role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role; // Ensure the backend includes 'role' in the token

      // Redirect based on role
      if (userRole === "manager") {
        navigate("/dashboard"); // Redirect to admin dashboard
      } else {
        navigate("/todos"); // Redirect to user dashboard
      }
    } catch (error) {
      setErrorMessage("Error logging in. Please check your credentials.");
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
          Log in to EagleLion Task Management
        </h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
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
              style={{
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
              }}
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
              style={{
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
              }}
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
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold"
            style={{ color: PRIMARY_COLOR }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
