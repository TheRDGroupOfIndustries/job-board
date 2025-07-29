import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { UserIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/useAuth";
import { registerUser } from "../../API";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("jobseeker");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match.");
  }

  if (!formData.agree) {
    return toast.warn("Please accept our terms and privacy policy.");
  }

  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    role,
  };

  try {
    const response = await registerUser(payload)

    const { accessToken, role: userRole } = response.data.data;

    login(accessToken,userRole);
    // localStorage.setItem("token", accessToken);
     

    toast.success(response.data?.message || "Account created successfully!");

    if (userRole === "jobseeker") navigate("/jobseeker-profile");
    else if (userRole === "company") navigate("/company-profile");
    else navigate("/admin-dashboard");
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Registration failed.";
    toast.error(errorMessage);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-4 bg-gray-100">
      <div className="flex items-center justify-center flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden text-white shadow-2xl bg-white/10 backdrop-blur border border-white/20">
        <section className="w-full md:w-1/2 bg-gradient-to-br from-purple-800/80 via-purple-900/70 to-gray-900/90 p-8 sm:p-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">JobFinder</h1>
            <p className="text-gray-300">Join to discover jobs or hire top talent.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 mb-8">
            {["jobseeker", "company"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-5 py-2 rounded-full font-bold transition ${
                  role === r
                    ? "bg-white text-purple-900"
                    : "bg-transparent text-white border border-white"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
                <div className="text-xs font-normal">
                  {r === "jobseeker"
                    ? "Looking for work"
                    : "Hiring talent"
                    }
                </div>
              </button>
            ))}
          </div>
          <h2 className="text-lg font-bold text-center mb-4">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {["firstName", "lastName"].map((name, index) => (
                <div className="relative w-full" key={index}>
                  <input
                    type="text"
                    name={name}
                    placeholder={name === "firstName" ? "First Name" : "Last Name"}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-10 border border-white/30 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none"
                  />
                  <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pl-10 border border-white/30 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none"
              />
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
            {["password", "confirmPassword"].map((field, i) => (
              <div className="relative" key={i}>
                <input
                  type="password"
                  name={field}
                  placeholder={field === "password" ? "Password" : "Confirm Password"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pl-10 border border-white/30 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none"
                />
                <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            ))}
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2"
              />
              I agree to the
              <a href="#" className="underline mx-1 text-indigo-300 hover:text-indigo-200">
                Terms
              </a>
              and
              <a href="#" className="underline mx-1 text-indigo-300 hover:text-indigo-200">
                Privacy Policy
              </a>
            </label>
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-purple-900 font-semibold transition"
            >
              {`Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-indigo-300 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </section>
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/10 backdrop-blur p-8 sm:p-10 text-center relative">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300 mb-4">
            Start Your Career Journey
          </h2>
          <img
            src="/undraw_global-team_8jok.svg"
            alt="Career Illustration"
            className="w-full max-w-xs h-auto mb-6"
          />
          <p className="text-sm text-gray-800 max-w-sm mb-6">
            Explore thousands of job opportunities, connect with top recruiters, and build your future with JobFinder.
          </p>
          <div className="bg-gradient-to-r from-pink-400 to-orange-300 text-purple-900 px-6 py-2 rounded-full font-semibold shadow mb-6">
            Your dream job is just a signup away!
          </div>
          <p className="text-sm italic text-gray-800">
            "Push yourself, because no one else is going to do it for you."
          </p>
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-300 opacity-20 rounded-full blur-2xl" />
        </section>
      </div>
    </div>
  );
};

export default Register;