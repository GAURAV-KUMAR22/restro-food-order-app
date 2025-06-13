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
      {sideBar.map((item, index) => {
        const isActive = location.pathname === item.pathName;
        return (
          <div className="flex ">
            <item.icons />
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};
