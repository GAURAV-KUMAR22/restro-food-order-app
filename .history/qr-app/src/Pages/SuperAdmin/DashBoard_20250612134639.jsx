import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";
import { Edit, Home, Trash2, User2Icon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../public/assets/saled.webp";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../../Context/AuthProvider";
import { useSelector } from "react-redux";
import { LayoutDashboard, Package, Folder, Shield, Users } from "lucide-react";

export const DashBoard = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);
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
    <div className="p-6 bg-white rounded-lg shadow-md h-[100vh]">
      {/* Top bar with title and search */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pending Admins List</h2>
        <input
          type="text"
          placeholder="Search name, email, etc."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Main Content: Sidebar + Table */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/7 border-r pr-4">
          {sideBar.map((item, i) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-2 p-2 text-sm rounded transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Table Content */}
        <div className="w-6/7">
          <div>
            <h1></h1>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-gray-200 text-2xl hover:bg-white text-center text-black font-extrabold ">
              All Admins
            </div>
            <div className="h-20 bg-gray-200 hover:bg-white text-center text-black font-extrabold ">
              Approvel Pending Admins
            </div>
            <div className="h-20 bg-gray-200 hover:bg-white text-center text-black font-extrabold ">
              All Admins
            </div>
            <div className="h-20 bg-gray-200 hover:bg-white text-center text-black font-extrabold ">
              All Admins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// <table className="w-full text-left border-collapse">
//             <thead className="text-gray-600 text-sm border-b">
//               <tr>
//                 <th className="py-2 px-4">Name</th>
//                 <th className="py-2 px-4">Contact</th>
//                 <th className="py-2 px-4">Status</th>
//                 <th className="py-2 px-4">Address</th>
//                 <th className="py-2 px-4">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm">
//               {pendingAdmins.map((item, index) => (
//                 <tr key={index} className="border-t hover:bg-gray-50">
//                   <td className="py-3 px-4 flex items-center space-x-2">
//                     {item.avatar ? (
//                       <img
//                         src={`${BackendUrl}/${item.avatar}`}
//                         alt="avatar"
//                         className="w-8 h-8 rounded-full"
//                       />
//                     ) : (
//                       <User2Icon size={25} />
//                     )}
//                     <div>
//                       <div className="font-medium">{item.name}</div>
//                       <div className="text-gray-500 text-xs">
//                         {item.name?.split(" ")[0]}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="py-3 px-4">
//                     <div>{item.email}</div>
//                     <div className="text-gray-500 text-xs">{item.phone}</div>
//                   </td>

//                   <td className="py-3 px-4 text-blue-500">
//                     {item.isApproved ? "ACTIVE" : "INACTIVE"}
//                   </td>

//                   <td className="py-3 px-4">{item.address}</td>

//                   <td className="py-3 px-4 flex space-x-3">
//                     <button
//                       onClick={() =>
//                         handleUpdateStatus({ item, status: "approved" })
//                       }
//                       className="hover:text-green-600"
//                     >
//                       <Edit className="w-4 h-4 text-gray-600" />
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleUpdateStatus({ item, status: "reject" })
//                       }
//                       className="hover:text-red-600"
//                     >
//                       <Trash2 className="w-4 h-4 text-gray-600" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
