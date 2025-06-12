import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";
import publicAxios from "../../Services/PublicAxios";
import { set } from "mongoose";
import PrivateAxios from "../../Services/PrivateAxios";
import { Sidebar } from "../../components/SuperAdmin/Sidebar";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import icons from '../../../public/assets/'

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
        <div>SuperAdmin</div>
        <div>
          <Link>All Admin</Link>
          <Link>Pending Approval</Link>
        </div>
        <div>
            <img src="" alt="" srcset="" />
        </div>
      </div>
      <div className="flex flex-row">
        <div className=" w-1/5 h-[100vh]">
          {sideBar.map((item, index) => (
            <Sidebar item={item} />
          ))}
        </div>
        <div className=" w-full">
          <div className="grid grid-cols-4 space-x-3 mt-3 px-3 ">
            <div className="bg-gray-200 h-25">
              <Link to={`/superAdmin/admin-list`}>
                <h1 className="text-blue-600 text-center text-xl font-semibold">
                  All Admins
                </h1>
              </Link>
            </div>
            <div className="bg-gray-200 h-25">
              <Link to={`/superAdmin/pending-admin`}>
                <h1 className="text-blue-600 text-center text-xl font-semibold">
                  Pending Admins
                </h1>
              </Link>
            </div>
            <div className="bg-gray-200 h-25">
              <Link>
                <h1 className="text-blue-600 text-center text-xl font-semibold">
                  All Admins
                </h1>
              </Link>
            </div>
            <div className="bg-gray-200 h-25">
              <Link>
                <h1 className="text-blue-600 text-center text-xl font-semibold">
                  All Admins
                </h1>
              </Link>
            </div>
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
