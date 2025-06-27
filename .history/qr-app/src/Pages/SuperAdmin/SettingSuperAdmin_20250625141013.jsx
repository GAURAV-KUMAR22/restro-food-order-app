import React from "react";
import { Link, Outlet } from "react-router-dom";

export const SettingSuperAdmin = () => {
  return (
    <div className="flex justify-start  p-2 bg-gray-200 h-[100vh]">
      <div className="w-full">
        <h1 className="text-2xl text-center text-gray-400 mb-5">Settings</h1>
        <ul className=" w-full grid grid-cols-7 gap-5 shrink-0">
          <Link
            to={`${location.pathname}/packages`}
            className="p-2 bg-white flex justify-center items-center hover:bg-gray-400 capitalize text-xl "
          >
            Packages
          </Link>
        </ul>
      </div>
    </div>
  );
};
