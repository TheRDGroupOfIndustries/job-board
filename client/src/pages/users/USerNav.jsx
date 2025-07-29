import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Menu, X, ChevronDown } from "lucide-react"; // for hamburger icon

const USerNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const userFullName = localStorage.getItem("userFullName");

  const handleLogout = () => {
    logout("Signed out successfully");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] shadow-md sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto py-3 px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500 tracking-wide">
          <Link to="/">JobFinder</Link>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-gray-700 focus:outline-none"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop User Section */}
        <div className="hidden sm:flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-white/20 px-2 py-1 rounded-lg transition"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <span className="text-gray-800 font-medium">
                {userFullName || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-pink-400 text-gray-700 flex items-center justify-center font-bold text-lg border border-gray-300 shadow">
                {userFullName ? userFullName.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <Link
                  to="/update-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition"
                >
                  Profile Setting
                </Link>
                <Link
                  to="/jobseeker-dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu with Smooth Transition */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-500 px-4 ${
          showMobileMenu ? "max-h-[300px] py-4" : "max-h-0"
        }`}
      >
        <div className="bg-white rounded-xl shadow border p-4 space-y-3">
          <Link
            to="/jobseeker-setting"
            className="block text-gray-800 hover:text-orange-500"
            onClick={() => setShowMobileMenu(false)}
          >
            Profile Setting
          </Link>
          <Link
            to="/jobseeker-dashboard"
            className="block text-gray-800 hover:text-orange-500"
            onClick={() => setShowMobileMenu(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setShowMobileMenu(false);
            }}
            className="block text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default USerNav;