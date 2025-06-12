import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";

export const DashBoard = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);
  const sideBar = [
    { name: "Dashboard" },
    { name: "Products" },
    { name: "Categorys" },
    { name: "Admin" },
    { name: "Users" },
  ];
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
    <div>
      <div className="bg-blue-200">
        <h1 className="text-2xl font-bold flex justify-center items-center">
          SuperAdmin Panel
        </h1>
      </div>
      <div className="flex flex-row">
        <div className="bg-gray-400 w-1/5 h-[100vh]">
          {sideBar.map((item, index) => (
            <Sidebar item={item} />
          ))}
        </div>
        <div className=" w-full">
          <div className="grid grid-cols-4 space-x-3 mt-3 px-3 ">
            <div className="bg-gray-500 h-25">
              <h1>All Admins</h1>
            </div>
            <div className="bg-gray-500">yellow</div>
            <div className="bg-gray-500">bleu</div>
            <div className="bg-gray-500">black</div>
          </div>
        </div>
      </div>
    </div>
  );
};

//  <div>
//         {pendingAdmins.map((item, index) => (
//           <AdminCard item={item} />
//         ))}
//       </div>
