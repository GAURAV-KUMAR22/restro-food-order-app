import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { Loader } from "lucide-react";

export const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === false) return <Navigate to="/login" />;
  if (isAuthenticated === null)
    return (
      <p className="flex justify-center items-center">
        <Loader size={45} />
      </p>
    );

  return <Outlet />;
};
