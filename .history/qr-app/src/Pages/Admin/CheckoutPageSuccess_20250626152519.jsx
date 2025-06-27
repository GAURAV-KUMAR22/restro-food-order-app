import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const CheckoutPageSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/payment/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment verified:", data);
        })
        .catch((err) => {
          console.error("Verification failed", err);
        });
    }
  }, [sessionId]);

  return <div>Payment Successful!</div>;
};
