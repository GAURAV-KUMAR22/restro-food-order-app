import { icons, LayoutDashboard } from "lucide-react";
import React from "react";

export const AdminDetails = () => {
  const sideBar = [
    { name: "Dashboard", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Products", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Category", pathName: "/:id/dashboard", icons: LayoutDashboard },
  ];
  return (
    <div>
      <div className="flex flex-row bg-gray-300">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          return (
            <div
              className={`flex flex-row ${
                isActive ? "bg-blue-500" : null
              } bg-white text-[black]`}
            >
              <item.icons />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
