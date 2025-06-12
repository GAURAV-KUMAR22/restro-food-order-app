import React, { createContext, useContext, useEffect, useState } from "react";
import PrivateAxios from "../src/Services/PrivateAxios.js";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner9 } from "react-icons/im";
import { loginSuccess } from "../src/Redux/Fetures/authSlice.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await PrivateAxios.get("/auth/check"); // must return token
        if (res.status === 200 && res.data?.token) {
          dispatch(loginSuccess({ token: res.data.token }));
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // If no token, check server
    if (!token) {
      checkAuth();
    } else {
      setAuthenticated(true); // already logged in
      setLoading(false);
    }
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ImSpinner9 className="animate-spin text-blue-600" size={70} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
