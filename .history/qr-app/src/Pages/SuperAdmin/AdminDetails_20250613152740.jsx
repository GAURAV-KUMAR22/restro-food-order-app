import { LayoutDashboard } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

export const AdminDetails = () => {
  const location = useLocation();
  const { id } = useParams(); // Example: "123"

  const sideBar = [
    { name: "Dashboard", pathName: "dashboard", icon: LayoutDashboard },
    { name: "Products", pathName: "products", icon: LayoutDashboard },
    { name: "Category", pathName: "category", icon: LayoutDashboard },
  ];

  return (
    <div>
      {/* Sidebar */}
      <div className="flex flex-row items-center bg-gray-200 h-11 space-x-8 px-2">
        {sideBar.map((item, index) => {
          const fullPath = `/superAdmin/admin-list/${id}/${item.pathName}`;
          const isActive = location.pathname === fullPath;

          return (
            <Link
              key={index}
              to={fullPath}
              className={`flex flex-row space-x-2 px-2 py-1 rounded ${
                isActive ? "bg-blue-500 text-white" : "text-black"
              }`}
            >
              <item.icon />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Nested page content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
