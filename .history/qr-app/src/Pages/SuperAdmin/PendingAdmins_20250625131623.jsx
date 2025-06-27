import React, { useEffect, useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { User2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { socket } from "../../Services/Socket";
import { PiEmptyLight } from "react-icons/pi";

export const PendingAdmins = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    fetchPendingAdmins();

    // Set up real-time listener once
    socket.on("update-admin", fetchPendingAdmins);

    // Clean up listener
    return () => {
      socket.off("update-admin", fetchPendingAdmins);
    };
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await PrivateAxios.get("/auth/pending-admin");
      setPendingAdmins(response.data.content);
    } catch (error) {
      toast.error("Failed to fetch pending admins.");
    }
  };

  const handleUpdateStatus = async ({ item, status }) => {
    if (status === "reject") {
      const confirmReject = window.confirm(
        "Are you sure you want to reject this admin's access?"
      );
      if (!confirmReject) return;
    }

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

  return (
    <div className="w-full ">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ImSpinner9 className="animate-spin text-gray-500" size={60} />
        </div>
      ) : pendingAdmins.length > 0 ? (
        <>
          {/* Desktop view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-gray-600 text-sm border-b bg-gray-100">
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
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center space-x-2">
                      {item.avatar ? (
                        <img
                          src={`${BackendUrl}/${item.avatar}`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User2Icon size={25} className="text-gray-500" />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500 text-xs capitalize">
                          {item.name?.split(" ")[0]}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{item.email}</div>
                      <div className="text-gray-500 text-xs">{item.phone}</div>
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        item.isApproved ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.isApproved ? "ACTIVE" : "PENDING"}
                    </td>
                    <td className="py-3 px-4">{item.address}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white text-sm shadow hover:bg-green-600 transition"
                        onClick={() =>
                          handleUpdateStatus({ item, status: "approved" })
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-gray-500 text-white text-sm shadow hover:bg-gray-600 transition"
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

          {/* Mobile view */}
          <div className="block md:hidden">
            {pendingAdmins.map((item, index) => (
              <div key={index} className="border rounded-lg mb-4 p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  {item.avatar ? (
                    <img
                      src={`${BackendUrl}/${item.avatar}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User2Icon size={28} className="text-gray-500" />
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  📞 {item.phone}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  📍 {item.address}
                </div>
                <div
                  className={`text-sm font-semibold mb-2 ${
                    item.isApproved ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.isApproved ? "ACTIVE" : "PENDING"}
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-1 rounded bg-green-500 text-white text-sm shadow hover:bg-green-600 transition"
                    onClick={() =>
                      handleUpdateStatus({ item, status: "approved" })
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 px-3 py-1 rounded bg-gray-500 text-white text-sm shadow hover:bg-gray-600 transition"
                    onClick={() =>
                      handleUpdateStatus({ item, status: "reject" })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center py-8 text-gray-500">
          <PiEmptyLight size={48} />
          <p className="mt-2">No pending admins</p>
        </div>
      )}
    </div>
  );
};
