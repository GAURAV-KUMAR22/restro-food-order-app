import React from "react";
import { Link, Outlet } from "react-router-dom";

export const SettingSuperAdmin = () => {
  const sideBar = [
    { name: "Package", path: "/superadmin/setting" },
    { name: "Package", path: "/superadmin/setting" },
    { name: "Package", path: "/superadmin/setting" },
  ];
  return (
    <div className="flex justify-start  p-2 bg-gray-200 h-[100vh]">
      <div className="w-full">
        <sideBar className="w-[20%]"></div>
        <div>anothe content</div>
      </div>
    </div>
  );
};
