import React from "react";
import { useEffect } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";
import { set } from "mongoose";

export const AllAdmin = ({ item }) => {
  const [admins, setAdmins] = useState([]);
  async function handleAprovedAdmin(admin) {
    const responce = await PrivateAxios.patch("/auth/update/admin", {
      _id: admin._id,
    });
    console.log(responce);
    if (responce.status === 200) {
      alert("status updated");
    }
  }
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
          <thead className="text-gray-600 text-sm border-b px-2">
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((item, index) => (
              <tr key={index} className="space-y-3">
                <td className="capitalize px-2">{item._id}</td>

                <td className="capitalize">{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                {/* <td className="space-x-3 space-y-2">
                  <button
                    className="p-2 bg-green-400"
                    onClick={() => handleAprovedAdmin(item)}
                  >
                    Approved
                  </button>
                  <button className="p-2 bg-gray-400">Rejected</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
