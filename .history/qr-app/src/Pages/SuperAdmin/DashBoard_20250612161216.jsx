import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";
import { Edit, Home, Trash2, User, User2Icon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../public/assets/saled.webp";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../../Context/AuthProvider";
import { useSelector } from "react-redux";
import { LayoutDashboard, Package, Folder, Shield, Users } from "lucide-react";

export const DashBoard = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const sideBar = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={15} />,
      path: "/superAdmin",
    },
    {
      name: "Products",
      icon: <Package size={15} />,
      path: "/superAdmin/products",
    },
    {
      name: "Categories",
      icon: <Folder size={15} />,
      path: "/superAdmin/categories",
    },
    {
      name: "Admins",
      icon: <Shield size={15} />,
      path: "/superAdmin/admin-list",
    },
    { name: "Users", icon: <Users size={15} />, path: "/superAdmin/users" },
  ];
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  console.log(token);
  useEffect(() => {
    if (!token) {
      navigate("/login/superadmin");
    }
  }, []);

  if (loading) {
    <div className="flex justify-center items-center">
      <ImSpinner9 className="animate-spin" size={70} />
    </div>;
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-[100vh]">
      {/* Top bar with title and search */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pending Admins List</h2>
        <div className="space-x-2 ">
          <input
            type="text"
            placeholder="Search name, email, etc."
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button className="p-2 bg-red-400 font-semibold rounded-lg">
            Logout
          </button>
          <div className="rounded-full bg-gray-500">
            <img src={User} alt="" className="rounded-full" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="w-full">
        <div>
          <h1></h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-20 bg-gray-200 text-2xl hover:bg-white text-center text-black font-extrabold ">
            <Link to={"/superAdmin/admin-list"}> All Admins</Link>
          </div>
          <div className="h-20 bg-gray-200 text-2xl hover:bg-white text-center text-black font-extrabold ">
            <Link to={"/superAdmin/pending-admin"}>
              Approvel Pending Admins
            </Link>
          </div>
          <div className="h-20 bg-gray-200 text-2xl hover:bg-white text-center text-black font-extrabold ">
            Approvel Rejected Admins
          </div>
          <div className="h-20 bg-gray-200 text-2xl hover:bg-white text-center text-black font-extrabold ">
            Manage SuperAdmin
          </div>
        </div>
      </div>
    </div>
  );
};

//
