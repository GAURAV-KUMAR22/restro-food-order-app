import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";
import publicAxios from "../../Services/PublicAxios";
import PrivateAxios from "../../Services/PrivateAxios";

export const Package = () => {
  const [packageItems, setPackageItems] = useState([]);

  // ✅ Fetch packages
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
    }
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  // ✅ Razorpay Checkout Handler
  const handleCheckout = async (pkg) => {
    try {
      const adminId = localStorage.getItem("adminId");

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + pkg.durationInDays);

      const response = await publicAxios.post("/api/payment/create-order", {
        packageTitle: pkg.title,
        amount: pkg.offerPrice || pkg.price,
        packageId: pkg._id,
        durationInDays: pkg.durationInDays,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        adminId,
      });

      const { id: order_id, amount, currency } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Set in .env file
        amount,
        currency,
        name: "Your App Name",
        description: pkg.title,
        order_id,
        handler: async function (response) {
          const verifyRes = await publicAxios.post(
            "/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.message === "Payment verified successfully") {
            toast.success("✅ Payment Successful");
          } else {
            toast.error("❌ Payment verification failed");
          }
        },
        prefill: {
          name: "User Name", // Can get from auth context
          email: "user@example.com",
        },
        theme: {
          color: "#007BFF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Checkout Error:", error);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="h-full mt-10 px-10">
      <h1 className="text-2xl font-bold text-center">Pick the Best Plan</h1>
      <p className="text-center text-sm">
        Choose your desired plan to get access to our premium content
      </p>

      <div
        className="flex flex-col sm:flex-row justify-center overflow-x-scroll my-10 gap-12 scroll-smooth snap-center"
        style={{ scrollbarWidth: "none" }}
      >
        {packageItems.map((item, index) => {
          const centerIndex = Math.floor(packageItems.length / 2);
          const offset = index - centerIndex;
          const rotation = offset * 2;
          const translateY = Math.abs(offset) * 4;

          return (
            <div
              key={index}
              className={`min-w-[280px] w-[300px] h-[600px] bg-blue-100 shadow-xl p-6 rounded-xl transition-transform duration-500 hover:scale-105 flex flex-col justify-between items-center`}
              style={{
                transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
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
