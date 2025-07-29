import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Header = () => {
  const { isAuthenticated, role } = useAuth();

  let dashboardPath = "/jobseeker-dashboard";
  if (role === "company") dashboardPath = "/company-dashboard";
  else if (role === "jobseeker") dashboardPath = "/jobseeker-dashboard";

  return (
    <header className="bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] py-4 px-6 sticky top-0 z-40">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500"
        >
          JOB
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
            Finder
          </span>
        </Link>

        {/* Browse Job */}
        <div className="flex gap-2">
          <Link
            to="/jobCardGrid"
            className="px-4 py-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border border-transparent hover:border-pink-400 hover:scale-105 hover:shadow-md transition-all duration-300 rounded-md font-medium"
          >
            Browse Job
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/auth/login"
                className="px-4 py-2 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-orange-300 text-gray-700 rounded-md font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to={dashboardPath}
              className="px-4 py-2 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
