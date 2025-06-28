import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const IsSubscriber = ({ children }) => {
  const navigate = useNavigate();
  const subscription = useSelector((state) => state.auth.subscription);
  const isSubscribed = useSelector((state) => state.auth.isSubscribed);

  const expired =
    !subscription || new Date(subscription.expiresAt) <= new Date();
  console.log(new Date(subscription.expiresAt) - new Date());
  console.log(expired);
  useEffect(() => {
    if (expired || isSubscribed === false) {
      navigate("/admin/package", { replace: true });
    }
  }, [expired, isSubscribed, navigate]);

  if (expired || isSubscribed === false) {
    return null; // Or a loading spinner while redirect happens
  }

  return children;
};

export default IsSubscriber;
