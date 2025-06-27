import React, { useCallback, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";

export const PackagesSuperAdmin = () => {
  const [packageItem, setpackageItems] = useState([]);
  const fetchpackageItem = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/packageItem");
      if (response.status !== 200) {
        throw toast.error("response Failed");
      } else {
        setpackageItems(response.data.content);
      }
    } catch (error) {
      throw new Error("error");
    }
  });
  return (
    <div className="px-2">
      <div>
        <header className="flex justify-end items-center p-2">
          <Link
            to={`${location.pathname}/new-packageItem`}
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
            className="flex flex-col sm:flex-row justify-center overflow-x-scroll my-10 gap-12 scroll-smooth snap-center"
            style={{ scrollbarWidth: "none" }}
          >
            {packageItem &&
              packageItem.length > 0 &&
              packageItem.map((item, index) => (
                <div
                  key={index}
                  className=" relative min-w-[250px] h-[600px]  p-2 bg-blue-100 shadow-2xl hover:scale-105 transition duration-300 ease-in-out m-4 "
                >
                  <h1 className="text-center text-3xl font-bold">
                    {item.title}
                  </h1>
                  <p className="flex justify-center items-center mx-auto mt-4 w-[20%] bg-blue-600 border-b-4 border-blue-600 mb-15"></p>
                  <p className="flex justify-center items-center ">
                    <FaRupeeSign size={30} />{" "}
                    <span className="text-4xl font-bold">{item.price}</span>
                  </p>
                  <p className="flex justify-center items-center font-semibold text-gray-500 ">
                    {item.durationInDays}
                  </p>

                  <div className="w-35 border-b flex justify-center items-center mt-5 mx-auto"></div>

                  <ul className="flex flex-col items-start text-sm font-bold gap-5 mt-10">
                    {item.features.map((fet, feIndex) => (
                      <li key={feIndex} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5 rounded-full">
                          ✅
                        </span>
                        <span>{fet}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="px-8 bg-blue-500 py-2 flex justify-center items-center mx-auto text-white mt-[50%] ">
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
