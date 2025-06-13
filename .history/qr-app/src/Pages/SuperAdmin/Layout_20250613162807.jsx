// components/SuperAdmin/SuperAdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  LayoutDashboard,
  User2Icon,
  UsersIcon,
  UserPenIcon,
  SquareArrowDown,
  User,
  User2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../Redux/Fetures/authSlice";
export const SuperAdminLayout = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [superAdminManage, setSuperAdminMange] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const superadminImage = useSelector((state) => state.auth.user.imageUrl);
  useEffect(() => {
    if (!token) {
      navigate("/login/superadmin");
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date(Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login/superadmin");
  };

  const sideBar = [
    { name: "Dashboard", pathName: "/superAdmin", icon: LayoutDashboard },
    { name: "All Admins", pathName: "/superAdmin/admin-list", icon: UsersIcon },
    {
      name: "Pending Admins",
      pathName: "/superAdmin/pending-admin",
      icon: UserPenIcon,
    },
  ];
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  function superadminManegeFuncton() {
    setSuperAdminMange((prev) => !prev);
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-screen">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 px-2 font-semibold">
        <h2 className="font-bold text-gray-400 italic text-2xl">
          SUPERADMIN PANEL
        </h2>
        <div className="flex space-x-4 h-10 items-center">
          <input
            type="text"
            placeholder="Search name, email, etc."
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
          />
          <BellIcon size={25} />
          <div>
            {superadminImage ? (
              <img
                src={`${backendUrl}/${superadminImage}`}
                alt="image"
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <User2 size={25} />
            )}
          </div>
          <div className="relative flex items-center space-x-2">
            <h1 className="text-sm font-medium text-black">UserName</h1>
            <button onClick={superadminManegeFuncton}>
              <SquareArrowDown size={25} />
            </button>

            {superAdminManage && (
              <div className="absolute top-10 right-0 w-40 bg-white shadow-lg rounded-md z-10 py-2">
                <ul className="flex flex-col space-y-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      User
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex bg-gray-200 h-10 my-2 items-center space-x-6">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          location.pathname.includes("admin-list");
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.pathName}
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-400 text-white"
                  : "text-[#2C333B] hover:bg-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Clock */}
      <div className="bg-[#2C333B] text-white w-fit px-2 h-10 flex items-center  rounded-lg my-2">
        Date {currentDateTime.toLocaleDateString()} Time{" "}
        {currentDateTime.toLocaleTimeString()}
      </div>

      {/* Page Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};
