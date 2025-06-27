import { loadStripe } from "@stripe/stripe-js";
import publicAxios from "../../Services/PublicAxios";
import toast from "react-hot-toast";
import React, { useCallback, useEffect, useState } from "react";
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Use env var
const stripePromise = loadStripe(
  "pk_test_51O2WGcSA02nW7pkxCKXqCijIhEuhKgPD57LOBDwasoGQB1VC63YB6djiYl24Edgtls2fYzxs7OteuDDIODEx7RPS00OXIs82xe"
);

export const Package = () => {
  console.log(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);
  console.log(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);
  const [packageItem, setpackageItems] = useState([]);
  const handleCheckout = async (data) => {
    try {
      const stripe = await stripePromise;

      // 1. Create checkout session on the server
      const response = await publicAxios.post(
        "/payment/create-checkout-session",
        {
          packageTitle: data.title,
          price: data.price,
        }
      );

      const session = response.data;

      // 2. Redirect to Stripe Checkout
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
  const handleFetchData = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
      console.log(response);
      if (response.status !== 200) {
        toast.error("Response failed");
        return;
      }
      setpackageItems(response.data.content);
    } catch (error) {
      toast.error("An error occurred while fetching packages");
    }
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);
  return (
    <div className=" h-full mt-10 px-10">
      <h1 className="text-2xl font-bold text-center">Pick Best the Plan</h1>
      <p className="text-center text-sm">
        Take your desired planto get accesss to our content
      </p>
      <div
        className="flex flex-col sm:flex-row justify-center overflow-x-scroll my-10 gap-12 scroll-smooth snap-center"
        style={{ scrollbarWidth: "none" }}
      >
        {packageItem.map((item, index) => {
          const centerIndex = Math.floor(packageItem.length / 2);
          const offset = index - centerIndex;
          const rotationClass = `rotate-[${offset * 2}deg] translate-y-[${
            Math.abs(offset) * 4
          }px]`;

          return (
            <div
              key={index}
              className={`min-w-[280px] w-[300px] h-[600px] bg-blue-100 shadow-xl p-6 rounded-xl transition-transform duration-500 hover:scale-105 flex flex-col justify-between items-center ${rotationClass}`}
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
                  handleCheckout({ title: item.title, price: item.price })
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
