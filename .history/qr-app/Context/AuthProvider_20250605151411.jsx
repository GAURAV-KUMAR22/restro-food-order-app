import React, { createContext, useContext, useEffect, useState } from "react";
import publicAxios from "../src/Services/PublicAxios";
import PrivateAxios from "../src/Services/PrivateAxios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthenticated(false);
        return;
      }

      try {
        await PrivateAxios.get("/auth/check"); // token is sent via interceptor
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
