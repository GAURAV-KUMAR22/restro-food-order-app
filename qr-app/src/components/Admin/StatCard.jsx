import React from "react";
import { BsBoxArrowInUp } from "react-icons/bs";
import { Link } from "react-router-dom";

export const StatCard = ({ name, value, imageName, route, items }) => {
  return (
    <div className="w-full flex  flex-row  sm:w-[70%] sm:gap-6  sm:h-[160px] md:flex-col  md:w-[90%] lg:w-[90%]   xl:w-full xl:flex-row h-[150px] f  shadow-md p-4  relative hover:scale-104 transition duration-300 hover:bg-sky-100 ">
      <Link
        to={route}
        state={{ items: items }}
        className="w-full h-full flex flex-col justify-between relative"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex justify-start">
          {imageName}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex-grow flex justify-center items-center">
            <span className="text-6xl font-bold text-start">
              {value.length}
            </span>
          </div>

          <p className="text-xl text-center text-nowrap">{name}</p>
        </div>
      </Link>
    </div>
  );
};
