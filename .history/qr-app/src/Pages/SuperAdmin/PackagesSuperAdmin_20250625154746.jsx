import React, { useCallback, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";

export const PackagesSuperAdmin = () => {
  const [packageItem, setpackageItems] = useState([]);
  const fetchpackageItem = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
      if (response.status !== 200) {
        toast.error("response Failed");
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
      <div>
        <header className="flex justify-end items-center p-2">
          <Link
            to={`${location.pathname}/new-package`}
            className="text-md rounded-sm font-semibold bg-blue-400 p-1 px-2"
          >
            Add packageItem
          </Link>
        </header>
        <div className=" h-full mt-10 px-10">
          <h1 className="text-2xl font-bold text-center">Our Plans</h1>
          <p className="text-center text-sm">
            Take your desired planto get accesss to our content
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center overflow-x-scroll my-2 gap-12 scroll-smooth snap-center"
            style={{ scrollbarWidth: "none" }}
          >
            {packageItem &&
              packageItem.length > 0 &&
              packageItem.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col hover:grow-5 justify-between w-[300px] h-[600px] bg-blue-100 shadow-xl p-4 rounded-xl hover:scale-105 transition-transform duration-300 m-4"
                >
                  <div>
                    <h1 className="text-center text-2xl font-bold">
                      {item.title}
                    </h1>

                    <div className="h-1 w-1/4 bg-blue-600 mx-auto my-4 rounded-full"></div>

                    {item.offerPrice && (
                      <p className="text-center text-gray-500 line-through text-lg">
                        ₹{item.price}
                      </p>
                    )}
                    <p className="text-center text-blue-800 font-bold text-3xl">
                      ₹{item.offerPrice || item.price}
                    </p>

                    <p className="text-center font-semibold text-gray-700 mt-2">
                      Duration:{" "}
                      <span className="text-black">
                        {item.durationInDays} days
                      </span>
                    </p>

                    <div className="border-b w-1/2 mx-auto my-4"></div>

                    <ul className="flex flex-col gap-3 text-sm font-semibold mt-4">
                      {item.features.map((fet, feIndex) => (
                        <li key={feIndex} className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✅</span>
                          <span>{fet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Select Plan
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
