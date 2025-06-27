import React, { useEffect, useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { User2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { socket } from "../../Services/Socket";

export const SuspendedAdmins = () => {
  const [suspendedAdmins, setSuspendedAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    fetched();
  }, []);

  const fetched = async () => {
    const response = await PrivateAxios.get("/auth/suspended-admin");
    if (response) {
      setSuspendedAdmins(response.data.content);
    }
  };

  async function handleUpdateStatus({ item, status }) {
    if (status === "accept") {
      const confirm = window.confirm("Are you sure to approve this admin?");
      if (!confirm) return;
    }

    socket.emit("update-adminList");

    try {
      setLoading(true);
      const response = await PrivateAxios.patch("/auth/update/admin", {
        _id: item._id,
        status,
      });

      if (response.status === 200) {
        toast.success("Successfully updated");
        fetched(); // Refresh after update
      }

      setLoading(false);
    } catch (error) {
      toast.error("Response Failed");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ImSpinner9 className="animate-spin" size={30} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-gray-600 text-sm border-b">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {suspendedAdmins?.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center space-x-2">
                  {item.avatar ? (
                    <img
                      src={`${BackendUrl}/${item.avatar}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User2Icon size={25} />
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
                <td className="py-3 px-4 text-red-500">
                  {item.isApproved ? "ACTIVE" : "PENDING"}
                </td>
                <td className="py-3 px-4">{item.address || "----"}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="p-2 bg-green-400 text-white rounded"
                    onClick={() =>
                      handleUpdateStatus({ item, status: "approved" })
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="p-2 bg-gray-400 text-white rounded"
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

      {/* Mobile View (Cards) */}
      <div className="md:hidden flex flex-col gap-4 mt-4">
        {suspendedAdmins?.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow rounded overflow-x-auto"
          >
            <div className="flex items-center space-x-2">
              {item.avatar ? (
                <img
                  src={`${BackendUrl}/${item.avatar}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User2Icon size={25} />
              )}
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-500 text-xs capitalize">
                  {item.name?.split(" ")[0]}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <strong>Email:</strong> {item.email}
            </div>
            <div className="text-sm text-gray-500">
              <strong>Phone:</strong> {item.phone}
            </div>
            <div className="text-sm">
              <strong>Status:</strong>{" "}
              <span className="text-red-500">
                {item.isApproved ? "ACTIVE" : "PENDING"}
              </span>
            </div>
            <div className="text-sm">
              <strong>Address:</strong> {item.address || "----"}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded"
                onClick={() => handleUpdateStatus({ item, status: "approved" })}
              >
                Approve
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-1 rounded"
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
