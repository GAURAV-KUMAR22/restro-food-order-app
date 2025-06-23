import { BellIcon, LayoutDashboard, User2 } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";

export const AdminDetails = () => {
  const [adminProfile, setAdminProfile] = useState();
  const location = useLocation();
  const { id } = useParams(); // Example: "123"
  console.log(adminProfile);
  const sideBar = [
    { name: "Dashboard", pathName: "dashboard", icon: LayoutDashboard },
    { name: "Products", pathName: "products", icon: LayoutDashboard },
    { name: "Category", pathName: "category", icon: LayoutDashboard },
  ];
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  console.log(id);
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/auth/adminProfile", {
        params: {
          id: id,
        },
      });
      setAdminProfile(response.data.content);
    };
    fetched();
  }, []);
  return (
    <div className="">
      {/* Sidebar */}
      <div className="flex justify-between bg-gray-200">
        <div className="flex flex-wrap items-center  w-full h-auto space-x-6 my-2 ">
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
        <div className="flex gap-2 justify-center items-center mr-5 ">
          <h1 className="flex flex-row font-semibold">{adminProfile?.name}</h1>
          <BellIcon size={20} />
          <img
            src={`${backendUrl}/${adminProfile?.avatar}`}
            alt="logo"
            className="w-9 h-9 rounded-full"
          />
        </div>
      </div>

      {/* Nested page content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
