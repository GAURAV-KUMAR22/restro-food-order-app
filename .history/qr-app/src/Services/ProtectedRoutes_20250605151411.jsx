import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

export const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === false) return <Navigate to="/login" />;
  if (isAuthenticated === null) return <p>Loading...</p>;

  return <Outlet />;
};
