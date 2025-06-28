import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../Redux/Fetures/authSlice";

export const CheckoutPageSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const sessionId = searchParams.get("session_id");
  console.log(sessionId);
  useEffect(() => {
    const fetchSuccess = async () => {
      try {
        const response = await PrivateAxios.get(
          "/payment/verify-checkout-session",
          {
            params: { session_id: sessionId },
          }
        );

        console.log("res[omkdfmkfmd", response);
        dispatch(
          loginSuccess({
            ...auth,
            subscription: response.subscription,
            isSubscribed: true,
          })
        );
        setPaymentDetails(response.data);
      } catch (error) {
        console.error("Error verifying payment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSuccess();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      {loading ? (
        <p className="text-gray-600 text-lg">Verifying your payment...</p>
      ) : (
        <>
          <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-700 mb-6">
            Thank you for subscribing to our plan.
          </p>

          {paymentDetails && (
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-sm text-left space-y-2">
              <p>
                <span className="font-semibold">Plan:</span>{" "}
                {paymentDetails?.session?.metadata?.packageTitle}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {(paymentDetails?.session?.amount_total || 0) / 100}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {paymentDetails?.customer?.email}
              </p>
              <p>
                <span className="font-semibold">Start:</span>{" "}
                {new Date(
                  paymentDetails?.session?.metadata?.startDate
                ).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">End:</span>{" "}
                {new Date(
                  paymentDetails?.session?.metadata?.endDate
                ).toLocaleDateString()}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
};
