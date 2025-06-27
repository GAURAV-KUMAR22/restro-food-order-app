import { loadStripe } from "@stripe/stripe-js";
import publicAxios from "../../Services/PublicAxios";
import PrivateAxios from "../../Services/PrivateAxios"; // make sure this exists
import toast from "react-hot-toast";
import React, { useCallback, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

// ✅ Only load Stripe once globally
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

  // ✅ Stripe checkout
  const handleCheckout = async (data) => {
    try {
      const stripe = await stripePromise;

      const response = await publicAxios.post(
        "/payment/create-checkout-session",
        {
          packageTitle: data.title,
          price: data.price,
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error(result.error.message);
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
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
              className={`min-w-[280px] w-[300px] h-[600px] bg-blue-100 shadow-xl p-6 rounded-xl transition-transform duration-500 hover:scale-105 flex flex-col justify-between items-center transform rotate-[${rotation}deg] translate-y-[${translateY}px]`}
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
                onClick={() =>
                  handleCheckout({
                    title: item.title,
                    price: item.offerPrice || item.price,
                  })
                }
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
