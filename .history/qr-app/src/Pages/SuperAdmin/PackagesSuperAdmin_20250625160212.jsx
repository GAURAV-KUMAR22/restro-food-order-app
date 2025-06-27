import React, { useCallback, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";

export const PackagesSuperAdmin = () => {
  const [packageItem, setpackageItems] = useState([]);
  const location = useLocation();

  const fetchpackageItem = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
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
    fetchpackageItem();
  }, [fetchpackageItem]);

  return (
    <div className="px-2">
      <header className="flex justify-end items-center p-2">
        <Link
          to={`${location.pathname}/new-package`}
          className="text-md rounded-sm font-semibold bg-blue-400 text-white p-1 px-3 hover:bg-blue-500"
        >
          + Add Package
        </Link>
      </header>

      <div className="h-full mt-4 px-4">
        <h1 className="text-2xl font-bold text-center">Our Plans</h1>
        <p className="text-center text-sm mb-6">
          Take your desired plan to get access to our content
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {packageItem.map((item, index) => {
            const centerIndex = Math.floor(packageItem.length / 2);
            const offset = index - centerIndex;
            const rotationClass = `rotate-[${offset * 2}deg] translate-y-[${
              Math.abs(offset) * 4
            }px]`;

            return (
              <div
                key={index}
                className={`min-w-[280px] w-[300px] h-[500px] bg-blue-100 shadow-xl p-6 rounded-xl transition-transform duration-500 hover:scale-105 flex flex-col justify-between items-center ${rotationClass}`}
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
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Select Plan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
