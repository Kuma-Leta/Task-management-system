import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import api_url from "../utils/constant";
import { GoogleLogin } from "@react-oauth/google"; // For Google OAuth

const PRIMARY_COLOR = "#801A1A";
const SECONDARY_COLOR = "#F6C026";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Auto-fill email from local storage if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: savedEmail,
      }));
      setForgotEmail(savedEmail);
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
    setErrorMessage("");
    setIsLoading(true);

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
      localStorage.setItem("authToken", token);

      // Save email to local storage for future auto-fill
      localStorage.setItem("userEmail", formData.email);

      // Decode the token to extract user role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      // Redirect based on role
      if (userRole === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/todos");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error logging in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);

      // Send the Google token to your backend for verification
      const response = await axios.post(`${api_url}/api/v1/auth/google`, {
        token: credentialResponse.credential,
      });

      toast.success("Google login successful!", {
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
      localStorage.setItem("authToken", token);

      // Save email to local storage for future auto-fill
      if (decodedToken.email) {
        localStorage.setItem("userEmail", decodedToken.email);
      }

      // Decode the token to extract user role
      const decodedBackendToken = jwtDecode(token);
      const userRole = decodedBackendToken.role;

      // Redirect based on role
      if (userRole === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/todos");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error with Google login. Please try again."
      );
    }
  };

  const handleGoogleLoginError = () => {
    setErrorMessage("Google login failed. Please try again.");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${api_url}/api/v1/auth/forgot-password`, {
        email: forgotEmail,
      });

      toast.success("Password reset instructions sent to your email!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setShowForgotPassword(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error sending reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
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
          <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded-md">
            {errorMessage}
          </div>
        )}

        {!showForgotPassword ? (
          <>
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
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2"
                    style={{ accentColor: PRIMARY_COLOR }}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold"
                  style={{ color: PRIMARY_COLOR }}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full p-3 rounded-md font-semibold transition-colors duration-200 flex justify-center items-center"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  color: "#fff",
                  border: `2px solid ${PRIMARY_COLOR}`,
                  opacity: isLoading ? 0.7 : 1,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="relative flex items-center my-6">
              <div
                className="flex-grow border-t"
                style={{ borderColor: PRIMARY_COLOR }}
              ></div>
              <span
                className="flex-shrink mx-4"
                style={{ color: PRIMARY_COLOR }}
              >
                Or
              </span>
              <div
                className="flex-grow border-t"
                style={{ borderColor: PRIMARY_COLOR }}
              ></div>
            </div>

            <div className="mb-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                theme="filled_blue"
                size="large"
                width="100%"
                text="signin_with"
              />
            </div>

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
          </>
        ) : (
          <div>
            <h3
              className="text-lg font-semibold mb-4 text-center"
              style={{ color: PRIMARY_COLOR }}
            >
              Reset Your Password
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-semibold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                  }}
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="w-1/2 p-3 rounded-md font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: "transparent",
                    color: PRIMARY_COLOR,
                    border: `2px solid ${PRIMARY_COLOR}`,
                  }}
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="w-1/2 p-3 rounded-md font-semibold transition-colors duration-200 flex justify-center items-center"
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    color: "#fff",
                    border: `2px solid ${PRIMARY_COLOR}`,
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Instructions"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
