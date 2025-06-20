import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  if (!token || role === "admin") {
    return <Navigate to="/login" />;
  } else {
    <Navigate to="/superadmin/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />; // Or /admin if you prefer
  }

  return children;
};
