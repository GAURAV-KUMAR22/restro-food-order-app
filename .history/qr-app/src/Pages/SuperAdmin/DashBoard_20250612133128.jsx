import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";
import { Edit, Home, Trash2, User2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import icons from "../../../public/assets/saled.webp";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../../Context/AuthProvider";
import { useSelector } from "react-redux";
import { LayoutDashboard, Package, Folder, Shield, Users } from "lucide-react";

export const DashBoard = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    const fetched = async () => {
      const responce = await PrivateAxios.get("/auth/pending-admin");
      if (responce) {
        setpendingAdmins(responce.data.content);
      }
    };
    fetched();
  }, []);

  async function handleUpdateStatus(items) {
    try {
      const data = { _id: items.item._id, status: items.status };
      setLoading(true);
      const responce = await PrivateAxios.patch("/auth/update/admin", data);
      if (responce.status === 200) {
        toast.success("successfully update");
      }
      setLoading(false);
    } catch (error) {
      toast.error("responce Failed");
      setLoading(false);
    }
  }

  if (loading) {
    <div className="flex justify-center items-center">
      <ImSpinner9 className="animate-spin" size={70} />
    </div>;
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">PendingAdmins List</h2>
        <input
          type="text"
          placeholder="Search name, email, etc."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64"
        />
      </div>
      <div>
        {sideBar.map((item, i) => (
          <Link key={i} to={item.path} className="flex gap-2 items-center p-2">
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="text-gray-500 text-sm">
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Contact</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Address</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {pendingAdmins.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-3 px-4 flex items-center space-x-2">
                {item.avatar ? (
                  <img
                    src={`${BackendUrl}/${item.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User2Icon size={25} />
                )}

                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500 text-xs">
                    {item.name.split(" ")[0]}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>{item.email}</div>
                <div className="text-gray-500 text-xs">{item.phone}</div>
              </td>
              <td className="py-3 px-4 text-blue-500">
                {item.isApproved === false ? "INACTIVE" : "ACTIVE"}
              </td>
              <td className="py-3 px-4">{item.address}</td>
              <td className="py-3 px-4 flex space-x-2">
                <button
                  onClick={() =>
                    handleUpdateStatus({ item, status: "approved" })
                  }
                >
                  <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
                </button>
                <button
                  onClick={() => handleUpdateStatus({ item, status: "reject" })}
                >
                  {" "}
                  <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
