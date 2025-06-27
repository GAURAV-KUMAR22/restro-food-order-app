import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import PrivateAxios from "../../Services/PrivateAxios";
import { socket } from "../../Services/Socket";

export const AllAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    socket.emit("join-superadmin");

    const fetchAdmins = async () => {
      try {
        const response = await PrivateAxios("/auth/admins");
        if (response.status === 200) {
          setAdmins(response.data.content);
        }
      } catch (err) {
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
    socket.on("update-admin", fetchAdmins);

    return () => {
      socket.off("update-admin", fetchAdmins);
    };
  }, []);

  const handleUpdateStatus = async ({ item, status }) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this admin's access?"
    );
    if (!confirmReject) return;

    try {
      setLoading(true);
      const data = { _id: item._id, status };
      const response = await PrivateAxios.patch("/auth/update/admin", data);
      if (response.status === 200) {
        toast.success("Status updated successfully.");
        socket.emit("update-adminList");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ImSpinner9 className="animate-spin text-gray-500" size={60} />
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4 mt-4">All Admins</h1>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-600 border-b">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {admins.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 text-blue-500">
                  <Link to={`${location.pathname}/${item._id}/dashboard`}>
                    {item._id}
                  </Link>
                </td>
                <td className="py-3 px-4 capitalize">{item.name}</td>
                <td className="py-3 px-4 break-all">{item.email}</td>
                <td className="py-3 px-4">{item.phone || "----"}</td>
                <td className="py-3 px-4">{item.address || "----"}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
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

      {/* Mobile cards */}
      <div className="block md:hidden space-y-4">
        {admins.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded p-4 border text-sm space-y-2"
          >
            <div className="text-blue-500 font-medium">
              <Link to={`${location.pathname}/${item._id}/dashboard`}>
                ID: {item._id}
              </Link>
            </div>
            <div>
              Name: <span className="capitalize">{item.name}</span>
            </div>
            <div>Email: {item.email}</div>
            <div>Phone: {item.phone || "----"}</div>
            <div>Address: {item.address || "----"}</div>
            <div className="pt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition w-full"
                onClick={() => handleUpdateStatus({ item, status: "reject" })}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
