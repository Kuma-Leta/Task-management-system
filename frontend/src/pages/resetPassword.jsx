// components/ResetPassword.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api_url from "../utils/constant";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      validateToken(token);
    }
  }, [searchParams]);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(
        `${api_url}/api/v1/auth/validate-reset-token/${token}`
      );
      setIsValidToken(true);
      setUserEmail(response.data.email);
    } catch (error) {
      toast.error("Invalid or expired reset token");
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = searchParams.get("token");
      await axios.post(`${api_url}/api/v1/auth/reset-password`, {
        token,
        ...formData,
      });

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return <div>Validating token...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#801A1A]">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password for {userEmail}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-[#801A1A]">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full p-3 border border-[#801A1A] rounded-md"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-[#801A1A]">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full p-3 border border-[#801A1A] rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#801A1A] text-white p-3 rounded-md font-semibold disabled:opacity-50"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
