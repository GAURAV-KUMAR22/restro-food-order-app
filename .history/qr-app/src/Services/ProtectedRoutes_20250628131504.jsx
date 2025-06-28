import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const adminSubScribe = useSelector((state) => state.auth.subscribe);

  if (!token) {
    // If no token, decide where to send based on role (if known)
    if (lastRole === "admin") {
      return <Navigate to="/login" replace />;
    } else {
      return <Navigate to="/superadmin/login" replace />;
    }
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
