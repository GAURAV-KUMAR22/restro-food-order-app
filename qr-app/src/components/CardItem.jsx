import React from "react";
import { Link } from "react-router-dom";
import "../Pages/Clients/Home.css";

export const CardItem = ({ name, imgPath }) => {
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  return (
    <div className="flex flex-col  ">
      <div
        className="icCard flex-col w-[62px] h-[62px] bg-[#D9D9D9] rounded-full my-auto mx-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <img
          src={`${backendUrl}/${imgPath}`}
          alt="category"
          className="w-[51px] h-[39px]  shadow-2xl shadow-gray-600 object-center rounded-full"
        />
      </div>

      <p className="text-black text-[13px] font-medium truncate w-full text-center capitalize">
        {name}
      </p>
    </div>
  );
};
