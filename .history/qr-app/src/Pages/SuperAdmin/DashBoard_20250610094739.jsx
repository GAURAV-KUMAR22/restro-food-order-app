import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";

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
        <div className="bg-red-400 w-1/5 h-[100vh]">
          {sideBar.map((item, index) => (
            <SideBar />
          ))}
        </div>
        <div className="bg-green-500 w-full"></div>
      </div>
    </div>
  );
};

//  <div>
//         {pendingAdmins.map((item, index) => (
//           <AdminCard item={item} />
//         ))}
//       </div>
