import React from "react";
import { useEffect } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";
import { set } from "mongoose";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { socket } from "../../Services/Socket";

export const AllAdmin = ({ item }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    socket.emit("join-superadmin");
    const fetched = async () => {
      const responce = await PrivateAxios("/auth/admins");
      if (responce.status === 200) {
        console.log(responce.data.content);
        setAdmins(responce.data.content);
      }
    };
    fetched();
    socket.on("update-admin", () => fetched());
  }, []);

  async function handleUpdateStatus(items) {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this admin's access?"
    );

    if (!confirmReject) return;
    socket.emit("join-superadmin");
    try {
      const data = { _id: items.item._id, status: items.status };
      setLoading(true);
      const responce = await PrivateAxios.patch("/auth/update/admin", data);
      if (responce.status === 200) {
        toast.success("successfully update");
      }
      socket.emit("update-adminList");
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
    <div className="flex">
      <div>
        <h1 className="text-3xl text-gray-500 text-left font-bold mt-3">
          All Admins
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="text-gray-600 text-sm border-b">
            <tr>
              <th className="pt-2 px-4 whitespace-nowrap">Sr.</th>
              <th className="pt-2 px-4 whitespace-nowrap">Name</th>
              <th className="pt-2 px-4 whitespace-nowrap">Email</th>
              <th className="pt-2 px-4 whitespace-nowrap">Phone</th>
              <th className="pt-2 px-4 whitespace-nowrap">Address</th>
              <th className="pt-2 px-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {admins.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="capitalize py-3 px-4">
                  <Link
                    className="text-blue-500 break-all"
                    to={`${location.pathname}/${item._id}/dashboard`}
                  >
                    {item._id}
                  </Link>
                </td>
                <td className="capitalize px-4">{item.name}</td>
                <td className="px-4 break-all">{item.email}</td>
                <td className="px-4">{item.phone || "----"}</td>
                <td className="px-4">{item.address || "----"}</td>
                <td className="px-4">
                  <button
                    className="bg-red-400 p-2 px-4 rounded shadow-md text-sm text-black font-semibold hover:bg-red-500 transition"
                    onClick={() =>
                      handleUpdateStatus({ item, status: "reject" })
                    }
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
