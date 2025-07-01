import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../Redux/Fetures/authSlice";

export const CheckoutPageSuccess = () => {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");
  const signature = searchParams.get("signature");
  const packageId = searchParams.get("packageId");
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    const verifyRazorpayPayment = async () => {
      if (!orderId || !paymentId || !signature || !packageId) {
        console.error("Missing Razorpay payment details");
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // or pkg.durationInDays if known

      try {
        const { data } = await axios.post("/api/payment/verify-payment", {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          userId: auth.user._id,
          packageId,
          startDate,
          endDate,
        });

        console.log(data);
        dispatch(
          loginSuccess({
            ...auth,
            subscription: data.subscription,
            isSubscribed: true,
          })
        );

        navigate("/payment-receipt-success");
      } catch (err) {
        console.error("Payment verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyRazorpayPayment();
  }, [orderId, paymentId, signature, packageId]);

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
            onClick={() => navigate("/admin")}
            className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
};
