import React, { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../../API";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");

    try {
      const response = await sendEmail({email})

      toast.success(response.data?.message || "OTP sent successfully");

      setTimeout(() => {
        navigate(`/auth/verify-email-otp?email=${encodeURIComponent(email)}`);
;
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex items-center justify-center px-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md rounded-3xl px-6 py-10 sm:p-10 bg-gradient-to-br from-purple-800/80 via-purple-900/70 to-gray-900/90 text-white shadow-2xl backdrop-blur border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Forgot Password?</h2>
          <p className="text-sm text-white/70 mt-2">
            Enter your email to receive an OTP for login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-full bg-white/10 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-black font-semibold hover:opacity-90 transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;