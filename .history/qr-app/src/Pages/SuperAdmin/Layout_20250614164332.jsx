// components/SuperAdmin/SuperAdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  LayoutDashboard,
  User2Icon,
  UsersIcon,
  UserPenIcon,
  SquareArrowDown,
  User2,
} from "lucide-react";
import { GoX } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../Redux/Fetures/authSlice";
export const SuperAdminLayout = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [superadminProfile, setSuperAdminProfile] = useState(true);
  const [updatedImage, setUpdatedImage] = useState();

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

  function handleChange(e) {
    console.log(e.target.[name]);
    console.log(e.target.value);
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-screen relative">
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
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setSuperAdminProfile(true)}
                    >
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
        {superadminProfile && (
          <div className="fixed inset-0 z-10">
            {/* 🔹 Blur Background Overlay */}
            <div className="absolute inset-0 drop-shadow-2xl bg-opacity-30 text-white backdrop-blur-sm z-10"></div>

            {/* 🔹 Modal Box */}
            <div className="absolute left-1/2 top-1/2 z-20 w-[500px] h-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
              <GoX size={25} className="absolute text-red-600 right-2 top-2" />
              <h1 className="text-center text-blue-400 border-b-2 mb-4">
                SuperAdmin Profile
              </h1>
              <form>
                <div className="flex flex-col gap-4">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="border p-2 rounded"
                    placeholder="Name"
                    onChange={handleChange}
                  />

                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="border p-2 rounded"
                    placeholder="Password"
                    onChange={handleChange}
                  />

                  <label htmlFor="image">Avatar</label>
                  <input
                    type="file"
                    id="image"
                    className="border p-2 rounded"
                    placeholder={superadminImage}
                    onChange={(e) => setUpdatedImage(e.target.files[0])}
                  />
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    className="border p-2 rounded"
                    placeholder="Address"
                    onChange={handleChange}
                  />
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="border p-2 rounded"
                    placeholder="Phone Number"
                  />
                  <button className="w-full bg-gray-400 p-2 mb-2">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
