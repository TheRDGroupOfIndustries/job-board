import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth"; 
import {  verifyLogin } from "../../API";

const VerifyEmailOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); 

  const email = new URLSearchParams(location.search).get("email");

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      return toast.error("Please enter the complete 6-digit OTP");
    }

    if (!email) {
      return toast.error("Email is missing. Please start over from Forgot Password.");
    }

    try {
      const response = await verifyLogin(
        { email, otp: fullOtp }
      )

      toast.success(response.data?.message || "Login successful");

      const { accessToken, role, profileCompleted } = response.data.data; 

      login(accessToken); 

      setTimeout(() => {
        if (role === "jobseeker") {
          navigate(profileCompleted ? "/jobseeker-dashboard" : "/jobseeker-profile");
        } else if (role === "company") {
          navigate(profileCompleted ? "/company-dashboard" : "/company-profile");
        } else {
          navigate("/admin-dashboard");
        }
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-4 bg-gray-100">
      <div className="w-full max-w-md sm:max-w-lg rounded-3xl p-8 sm:p-10 text-white shadow-2xl bg-gradient-to-br from-purple-800 via-purple-900 to-gray-900 backdrop-blur border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Verify OTP</h2>
          <p className="text-sm text-white/70 mt-2">
            Please enter the 6-digit code sent to <span className="font-semibold">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl bg-white/10 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-black font-semibold hover:opacity-90"
          >
            Verify OTP & Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailOtp;