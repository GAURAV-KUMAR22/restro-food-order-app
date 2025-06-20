import { BellIcon, LayoutDashboard, User2 } from "lucide-react";
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
    <div className="">
      {/* Sidebar */}
      <div className="flex justify-between">
        <div className="flex flex-wrap items-center bg-gray-200 h-11 space-x-6 ">
          {sideBar.map((item, index) => {
            const fullPath = `/superAdmin/admin-list/${id}/${item.pathName}`;
            const isActive = location.pathname === fullPath;

            return (
              <Link
                key={index}
                to={fullPath}
                className={`flex items-center space-x-2 px-3 py-2 rounded ${
                  isActive
                    ? "bg-blue-400 text-white"
                    : "text-[#2C333B] hover:bg-gray-300"
                }`}
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-3">
          <BellIcon size={25} />
          <User2 size={25} />
        </div>
      </div>

      {/* Nested page content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
