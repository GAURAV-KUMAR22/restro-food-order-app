import React from "react";
import { useEffect } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";
import { set } from "mongoose";

export const AllAdmin = ({ item }) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetched = async () => {
      const responce = await PrivateAxios("/auth/admins");
      if (responce.status === 200) {
        console.log(responce.data.content);
        setAdmins(responce.data.content);
      }
    };
    fetched();
  }, []);
  return (
    <div>
      <div>
        <h1 className="text-3xl text-center font-bold mt-3">All Admins</h1>
      </div>
      <div className=" mt-3 px-3">
        <table className="table-auto w-[100%] text-left border border-collapse border-gray-500">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((item, index) => (
              <tr key={index} className="space-y-3">
                <td className="capitalize">{item.name}</td>
                <td>{item.email}</td>
                <td className="space-x-3 space-y-2">
                  <button className="p-2 bg-green-400">Approved</button>
                  <button>Rejected</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
