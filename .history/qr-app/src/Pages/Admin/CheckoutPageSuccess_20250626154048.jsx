import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";

export const CheckoutPageSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
    const response = await PrivateAxios.get('/payment/verify-checkout-session',{
        params:{
            
        }
    })
    }
  }, [sessionId]);

  return <div>Payment Successful!</div>;
};
