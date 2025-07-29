import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Menu, X, ChevronDown, User, Settings,
  LayoutDashboard, LogOut, PlusCircle, FileText, Users
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/company-dashboard' },
  { id: 'post-job', label: 'Post Job', icon: PlusCircle, path: '/post-job' },
  { id: 'jobs', label: 'My Jobs', icon: FileText, path: '/company-jobs' },
 
  { id: 'settings', label: 'Settings', icon: Settings, path: '/company-setting' },
];

const CompanySidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menuRef = useRef(null);
  const { logout,  } = useAuth();
  const userFullName = localStorage.getItem("userCompanyFullName");
 
  const location = useLocation();

  const handleLogout = () => {
    logout('Signed out successfully');
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
                JobFinder
              </span>
            </Link>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} hidden lg:block`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {collapsed ? 'JF' : 'JobFinder'}
              </span>
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50'}`}
              >
                <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-gray-200">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center w-full p-2 rounded-lg hover:bg-blue-50 transition ${collapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
                    {userFullName.charAt(0) || 'U'}
                  </div>
                  {!collapsed && (
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {userFullName || 'User'}
                      </p>
                      
                    </div>
                  )}
                </div>
                {!collapsed && <ChevronDown className={`w-4 h-4 text-gray-500 ${showMenu ? 'rotate-180' : ''}`} />}
              </button>

              {showMenu && !collapsed && (
                <div className="absolute left-3 right-3 bottom-full mb-2 bg-white rounded-lg shadow-xl border-gray-100 overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${showMobileMenu ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50'}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium mr-3">
                {userFullName.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{userFullName || 'User'}</p>
               
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanySidebar;
