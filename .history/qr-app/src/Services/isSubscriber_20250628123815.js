import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const IsSubscriber = ({ children }) => {
  const subscription = useSelector((state) => state.auth.subscription);

  const expired =
    !subscription || new Date(subscription.expiresAt) <= new Date();

  if (expired) {
    return <Navigate to="/admin/package" replace />;
  }

  return children;
};

export default IsSubscriber;
