import React from "react";
import { FaRupeeSign } from "react-icons/fa";

export const Package = () => {
  return (
    <div className=" h-full mt-10 px-10">
      <h1 className="text-2xl font-bold text-center">Pick Best the Plan</h1>
      <p className="text-center text-sm">
        Take your desired planto get accesss to our content
      </p>
      <div className="flex flex-row justify-center overflow-x-scroll my-10 gap-12">
        <div className=" relative w-[300px] h-[600px] border p-2 bg-blue-100">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2 mb-15">
            Basic
          </h1>

          <p className="flex justify-center items-center ">
            <FaRupeeSign size={30} />{" "}
            <span className="text-4xl font-bold">800</span>
          </p>
          <p className="flex justify-center items-center font-semibold text-gray-500 ">
            Per Month
          </p>

          <div className="w-35 border-b flex justify-center items-center mt-5 mx-auto"></div>

          <ul className="flex flex-col items-start text-sm font-bold gap-5 mt-10">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 rounded-full">✅</span>
              <span>Take Orders and update</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Track only day by day order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Update Products only three times</span>
            </li>
          </ul>

          <button className="px-4 bg-blue-500 py-2 flex justify-center items-center mt-[10%] ">
            Select Plan
          </button>
        </div>

        <div className="w-[300px] h-[600px] border p-2">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2 mb-10">
            Basic
          </h1>

          <p className="flex justify-center items-center ">
            <FaRupeeSign size={30} />{" "}
            <span className="text-4xl font-bold">800</span>
          </p>
          <p className="flex justify-center items-center font-semibold text-gray-500 ">
            Per Month
          </p>

          <div className="w-35 border-b flex justify-center items-center mt-5 mx-auto"></div>

          <ul className="flex flex-col items-start text-sm font-bold gap-5 mt-10">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 rounded-full">✅</span>
              <span>Take Orders and update</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Track only day by day order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Update Products only three times</span>
            </li>
          </ul>
        </div>

        <div className="w-[300px] h-[600px] border p-2">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2 mb-10">
            Basic
          </h1>

          <p className="flex justify-center items-center ">
            <FaRupeeSign size={30} />{" "}
            <span className="text-4xl font-bold">800</span>
          </p>
          <p className="flex justify-center items-center font-semibold text-gray-500 ">
            Per Month
          </p>

          <div className="w-35 border-b flex justify-center items-center mt-5 mx-auto"></div>

          <ul className="flex flex-col items-start text-sm font-bold gap-5 mt-10">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 rounded-full">✅</span>
              <span>Take Orders and update</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Track only day by day order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✅</span>
              <span>Update Products only three times</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
