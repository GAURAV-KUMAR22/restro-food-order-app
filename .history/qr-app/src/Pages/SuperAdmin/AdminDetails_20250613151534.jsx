import { icons, LayoutDashboard } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

export const AdminDetails = () => {
  const sideBar = [
    { name: "Dashboard", pathName: "/dashboard", icons: LayoutDashboard },
    { name: "Products", pathName: "/products", icons: LayoutDashboard },
    { name: "Category", pathName: "/category", icons: LayoutDashboard },
  ];
  return (
    <div className="">
      <div className="flex flex-row items-center bg-gray-200 h-11 space-x-8 px-2">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          return (
            <Link
              key={index}
              to={item.pathName}
              className={`flex flex-row space-x-2 ${
                isActive ? "bg-blue-500" : null
              }  text-[black]`}
            >
              <item.icons />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
