import React from "react";

export const isSubscriber = () => {
  const isSubscribed = useSelector((state) => state.auth.isSubscribed);
  const subscription = useSelector((state) => state.auth.subscription);

  const expired =
    !subscription || new Date(subscription.expiresAt) <= new Date();

  if (!isSubscribed || expired) {
    return <Navigate to="/admin/package" />;
  }

  return children;
};
