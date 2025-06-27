import React from "react";
import { Link, Outlet } from "react-router-dom";

export const SettingSuperAdmin = () => {
  const sideBar = [{ name: "Package", path: "/superadmin/setting" }];
  return (
    <div className="flex justify-start  p-2 bg-gray-200 h-[100vh]">
      <div className="w-full">
        <h1 className="text-2xl text-center text-gray-400 mb-5">Settings</h1>
      </div>
    </div>
  );
};
