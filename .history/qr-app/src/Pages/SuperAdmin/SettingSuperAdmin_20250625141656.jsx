import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export const SettingSuperAdmin = () => {
  const location = useLocation();

  const sideBar = [
    { name: "Package", path: "/package" },
    { name: "Subscription", path: "/superadmin/setting/subscription" },
    { name: "Billing", path: "/superadmin/setting/billing" },
  ];

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-[20%] bg-blue-100 p-4 space-y-4 shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Settings</h2>
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-700 hover:bg-blue-200 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="w-[80%] p-6">
        <Outlet />
      </div>
    </div>
  );
};
