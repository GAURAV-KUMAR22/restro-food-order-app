import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const IsSubscriber = ({ children }) => {
  const naviagte = useNavigate();
  const subscription = useSelector((state) => state.auth.subscription);
  console.log(subscription);
  const expired =
    !subscription || new Date(subscription.expiresAt) <= new Date();
  console.log(expired);
  if (expired) {
    return naviagte("/admin/package");
  }

  return children;
};

export default IsSubscriber;
