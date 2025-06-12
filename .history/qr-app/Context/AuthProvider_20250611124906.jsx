import React, { createContext, useContext, useEffect, useState } from "react";
import PrivateAxios from "../src/Services/PrivateAxios.js";
import { LoaderCircle } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await PrivateAxios.get("/auth/check");
        if (res.status === 200) {
          setAuthenticated(res.data.authenticated);
        }
        setLoading(false);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <LoaderCircle size={45} />
      </div>
    );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
