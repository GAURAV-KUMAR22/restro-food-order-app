import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";
import { Edit, Home, LayoutDashboard, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import icons from "../../../public/assets/saled.webp";

export const DashBoard = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);
  const sideBar = [
    { name: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { name: "Products" },
    { name: "Categorys" },
    { name: "Admin" },
    { name: "Users" },
  ];

  const backednUrl = import.meta.

  useEffect(() => {
    const fetched = async () => {
      const responce = await PrivateAxios.get("/auth/pending-admin");
      if (responce) {
        setpendingAdmins(responce.data.content);
      }
    };
    fetched();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">pendingAdmins List</h2>
        <input
          type="text"
          placeholder="Search name, email, etc."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64"
        />
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
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
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
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.isApproved === "false"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item.isApproved}
                </span>
              </td>
              <td className="py-3 px-4">{item.address}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Showing 1 to 8 of 230 entries</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded">{"<"}</button>
          <button className="px-3 py-1 bg-black text-white rounded">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
          <button className="px-3 py-1 border rounded">...</button>
          <button className="px-3 py-1 border rounded">230</button>
          <button className="px-3 py-1 border rounded">{">"}</button>
        </div>
      </div>
    </div>
  );
};
