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

          <ul className="flex flex-col  items-start text-sm font-bold list-disc gap-5 mt-10">
            <li>Take Orders and update</li>
            <li>Track only day by day order</li>
            <li>Update Products only three time</li>
          </ul>
        </div>
        <div className="w-[300px] h-[600px] border p-2">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2 mb-5">
            Standard
          </h1>
        </div>
        <div className="w-[300px] h-[600px] border p-2">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2 mb-5">
            Premium
          </h1>
        </div>
      </div>
    </div>
  );
};
