import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);

  const lastActivityTime = useRef(Date.now());
  const sessionStartTime = useRef(
    parseInt(localStorage.getItem("sessionStartTime")) || Date.now()
  );

  // Update isAuthenticated in localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  // ✅ LOGIN FUNCTION
  const login = useCallback((newToken, userRole) => {
    setIsAuthenticated(true);
    setToken(newToken);
    setRole(userRole);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("sessionStartTime", Date.now().toString());

    sessionStartTime.current = Date.now();
    lastActivityTime.current = Date.now();
  }, []);

  // ✅ LOGOUT FUNCTION
  const logout = useCallback((message = null) => {
    setIsAuthenticated(false);
    setToken(null);
    setRole(null);

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("sessionStartTime");

    if (message) {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    navigate("/auth/login");
  }, [navigate]);

  // Handle unauthorized API responses
  useEffect(() => {
    const handleUnauthorizedResponse = (event) => {
      if (event.detail && event.detail.status === 401) {
        logout(event.detail.message || "Your session has expired. Please log in again.");
      }
    };

    window.addEventListener("unauthorized-response", handleUnauthorizedResponse);
    return () => {
      window.removeEventListener("unauthorized-response", handleUnauthorizedResponse);
    };
  }, [logout]);

  // Detect user activity
  useEffect(() => {
    const updateActivity = () => {
      lastActivityTime.current = Date.now();
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, []);

  // Session expiry check
  useEffect(() => {
    const checkSessionOnFocus = () => {
      if (isAuthenticated) {
        const sessionDuration = Date.now() - (parseInt(localStorage.getItem("sessionStartTime")) || sessionStartTime.current);
        const maxSessionTime = 6 * 60 * 60 * 1000; // 6 hours
        const idleTime = Date.now() - lastActivityTime.current;
        const maxIdleTime = 60 * 60 * 1000; // 60 minutes

        if (sessionDuration > maxSessionTime) {
          logout("Your session has expired. Please log in again.");
        } else if (idleTime > maxIdleTime) {
          logout("Your session has expired due to inactivity. Please log in again.");
        }
      }
    };

    window.addEventListener("focus", checkSessionOnFocus);
    checkSessionOnFocus();

    return () => {
      window.removeEventListener("focus", checkSessionOnFocus);
    };
  }, [isAuthenticated, logout]);

  // Auto logout on idle
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        const idleTime = Date.now() - lastActivityTime.current;
        if (idleTime >= 60 * 60 * 1000) {
          logout("Your session has expired due to inactivity. Please log in again.");
        }
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, logout]);

  // Final context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      token,
      role,
      login,
      logout,
    }),
    [isAuthenticated, token, role, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
