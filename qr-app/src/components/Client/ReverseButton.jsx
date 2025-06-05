import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

export const ReverseButton = ({ route, routeName, css }) => {
  return (
    <Link
      className={`flex ${css} gap-[4px] items-center justify-start  ml-2 mt-2`}
      to={`${route}`}
    >
      <span className="w-[18px] h-[20px]">
        <IoIosArrowBack size={20} />
      </span>
      <span className="text-base font-medium capitalize"> {routeName} </span>
    </Link>
  );
};
