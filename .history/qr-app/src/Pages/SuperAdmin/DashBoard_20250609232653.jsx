import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AdminCard } from "../../components/SuperAdmin/AdminCard";

export const DashBoard = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);
  useEffect(() => {}, []);
  return (
    <div>
      <div className="bg-blue-200">
        <h1 className="text-2xl font-bold flex justify-center items-center">
          SuperAdmin Panel
        </h1>
      </div>
      <div className="text-xl font-bold">Pending New Shop Requests</div>
      <div>
        {pendingAdmins.map((item, index) => (
          <AdminCard />
        ))}
      </div>
    </div>
  );
};
