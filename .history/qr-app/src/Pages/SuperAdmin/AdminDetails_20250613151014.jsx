import { icons, LayoutDashboard } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const AdminDetails = () => {
  const sideBar = [
    { name: "Dashboard", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Products", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Category", pathName: "/:id/dashboard", icons: LayoutDashboard },
  ];
  return (
    <div className="">
      <div className="flex flex-row items-center bg-gray-200 h-11 space-x-8">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          return (
            <Link
              className={`flex flex-row ${
                isActive ? "bg-blue-500" : null
              } bg-white text-[black]`}
            >
              <item.icons />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
