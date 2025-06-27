import React from "react";
import { Link } from "react-router-dom";

export const SettingSuperAdmin = () => {
  return (
    <div className="flex justify-start items-center p-2">
      <div className="w-full">
        <ul className=" w-full grid grid-cols-5 gap-5 shrink-0">
          <Link
            to={`${location.pathname}/packages`}
            className="p-2 bg-gray-200 flex justify-center items-center hover:bg-gray-400 capitalize text-xl "
          >
            Packages
          </Link>
        </ul>
      </div>
    </div>
  );
};
