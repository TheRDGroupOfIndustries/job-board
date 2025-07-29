import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { loginUser } from "../../API";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("All fields are required");
    return;
  }

  try {
    const response = await loginUser({email,password});

    // ✅ Backend se profileCompleted bhi le lo
    const { accessToken, role, profileCompleted } = response.data.data;

    login(accessToken, role);
    localStorage.setItem("token",accessToken);

    toast.success("Login successful!");

    // ✅ Ab role aur profileCompleted check karo
    if (role === "jobseeker") {
      if (profileCompleted) {
        navigate("/jobseeker-dashboard");
      } else {
        navigate("/jobseeker-profile");
      }
    } else if (role === "company") {
      if (profileCompleted) {
        navigate("/company-dashboard");
      } else {
        navigate("/company-profile"); // agar company ka bhi form hai
      }
    } else {
      navigate("/admin-dashboard");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    toast.error(errorMessage);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl text-white bg-white/10 backdrop-blur border border-white/20">
        <section className="w-full md:w-1/2 p-8 sm:p-10 bg-gradient-to-br from-purple-800/80 via-purple-900/70 to-gray-900/90 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Welcome Back</h2>
            <p className="text-sm text-white/80 mt-1">Login to your JobFinder account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-5 py-3 rounded-full bg-black/40 text-white placeholder:text-white/70 focus:outline-none shadow-inner"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-5 py-3 rounded-full bg-black/40 text-white placeholder:text-white/70 focus:outline-none shadow-inner"
                placeholder="Enter password"
              />
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <Link to="/auth/forgot-password" className="underline cursor-pointer">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-pink-400 to-orange-300 text-black transition"
            >
              Sign in
            </button>
            <p className="text-sm text-white/70 text-center mt-2">
              Don’t have an account?{" "}
              <Link to="/auth/register" className="underline text-pink-300">
                Sign up
              </Link>
            </p>
          </form>
        </section>
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/10 backdrop-blur p-10 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300 mb-4">
            Welcome Back 👋
          </h2>
          <p className="text-gray-800 text-sm max-w-md mb-6">
            We’re glad to see you again! Log in to continue your journey,
            explore exciting new opportunities, and connect with top companies.
          </p>
          <div className="mt-4 mb-6 bg-gradient-to-r from-pink-400 to-orange-300 text-purple-900 px-6 py-2 rounded-full font-semibold shadow">
            Let’s find your next big opportunity!
          </div>
          <div className="flex items-center justify-center mb-4">
            {[
              "https://randomuser.me/api/portraits/men/45.jpg",
              "https://randomuser.me/api/portraits/women/36.jpg",
              "https://randomuser.me/api/portraits/men/56.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0 shadow-md overflow-hidden"
              >
                <img src={src} alt={`User ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full -ml-2 flex items-center justify-center text-xs font-bold text-pink-900 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
              +100K
            </div>
          </div>
          <p className="text-sm italic text-white/70">
            "The best way to predict your future is to create it."
          </p>
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-300 opacity-20 rounded-full blur-2xl"></div>
        </section>
      </div>
    </div>
  );
}