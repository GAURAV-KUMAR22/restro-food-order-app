import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";
import publicAxios from "../../Services/PublicAxios";
import PrivateAxios from "../../Services/PrivateAxios";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Package = () => {
  const [packageItems, setPackageItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const navigate = useNavigate(); // ✅ Hook at the top level of component

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const handleFetchData = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
      if (response.status === 200) {
        setPackageItems(response.data.content);
      } else {
        toast.error("Failed to fetch packages");
      }
    } catch (error) {
      toast.error("An error occurred while fetching packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const handleCheckout = async (pkg) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + pkg.durationInDays);

      // Step 1: Create Razorpay order from your backend
      const orderRes = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        {
          amount: pkg.price,
          userId,
          packageId: pkg._id,
          startDate,
          endDate,
        }
      );

      const { orderId, amount, currency } = orderRes.data;

      // Step 2: Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: user.name,
        description: pkg.title,
        order_id: orderId,
        redirectUrl:
          `/payment-success` +
          `?payment_id=${response.razorpay_payment_id}` +
          `&order_id=${response.razorpay_order_id}` +
          `&signature=${response.razorpay_signature}` +
          `&packageId=${packageId}` +
          `&userId=${userId}` +
          `&startDate=${startDate}` +
          `&endDate=${endDate}`,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                packageId: pkg._id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              }
            );

            if (
              verifyRes.data.message === "Payment verified and plan updated"
            ) {
              window.location.href = verifyRes.data.redirectUrl;
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("❌ Verification error");
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#007BFF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        toast.error("❌ Payment failed or cancelled");
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("❌ Failed to initiate payment");
    }
  };

  if (loading) {
    return <div className="text-center">Loading packages...</div>; // Loading state
  }

  return (
    <div className="h-full mt-10 px-4 sm:px-10">
      <h1 className="text-2xl font-bold text-center">Pick the Best Plan</h1>
      <p className="text-center text-sm">
        Choose your desired plan to get access to our premium content
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10 justify-items-center ">
        {packageItems.map((item, index) => {
          const centerIndex = Math.floor(packageItems.length / 2);

          let rotateX = 0;
          let translateY = 0;

          if (index < centerIndex) {
            rotateX = 15;
            translateY = 10;
          } else if (index > centerIndex) {
            rotateX = -15;
            translateY = 10;
          }

          return (
            <div
              key={index}
              className="w-[300px] h-[500px] bg-blue-100 shadow-xl p-6 rounded-xl transition-transform duration-500 hover:scale-105 flex flex-col justify-between items-center"
              style={{
                transform: `rotateX(${rotateX}deg) translateY(${translateY}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <h2 className="text-2xl font-bold text-center">{item.title}</h2>

              <div className="flex flex-col items-center mt-4">
                <p className="flex items-center gap-1 text-4xl font-bold text-blue-700">
                  <FaRupeeSign /> {item.offerPrice || item.price}
                </p>
                {item.offerPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹{item.price}
                  </p>
                )}
              </div>

              <p className="text-sm font-medium text-gray-700 mt-2">
                Duration:{" "}
                <span className="font-bold text-black">
                  {item.durationInDays} days
                </span>
              </p>

              <ul className="mt-6 text-sm font-semibold space-y-2 text-left w-full">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✅</span>
                    <span className="capitalize">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(item)}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Select Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
