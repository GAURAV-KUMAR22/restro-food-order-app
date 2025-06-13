import { icons, LayoutDashboard } from "lucide-react";
import React from "react";

export const AdminDetails = () => {
  const sideBar = [
    { name: "Dashboard", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Products", pathName: "/:id/dashboard", icons: LayoutDashboard },
    { name: "Category", pathName: "/:id/dashboard", icons: LayoutDashboard },
  ];
  return <div></div>;
};
