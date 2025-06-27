import React, { useEffect, useState, useCallback } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { User2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { socket } from "../../Services/Socket";

export const SuspendedAdmins = () => {
  const [suspendedAdmins, setSuspendedAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const response = await PrivateAxios.get("/auth/suspended-admin");
      if (response?.data?.content) {
        setSuspendedAdmins(response.data.content);
      }
    } catch (err) {
      setError("Failed to fetch suspended admins.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async ({ item, status }) => {
    if (status === "approved") {
      const confirm = window.confirm("Are you sure to approve this admin?");
      if (!confirm) return;
    }

    socket.emit("update-adminList");
    try {
      setLoading(true);
      await PrivateAxios.patch("/auth/update/admin", {
        _id: item._id,
        status,
      });
      toast.success("Successfully updated");
      fetchData();
    } catch (error) {
      toast.error("Response Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center h-40">
          <ImSpinner9 className="animate-spin" size={30} />
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!loading && !error && (
        <>
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
                {suspendedAdmins.map((item, index) => (
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
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          item.status === "approved"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.status?.toUpperCase() || "PENDING"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.address || "----"}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        aria-label="Approve admin"
                        onClick={() =>
                          handleUpdateStatus({ item, status: "approved" })
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        aria-label="Reject admin"
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

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {suspendedAdmins.map((item, index) => (
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
                  <span
                    className={`font-semibold ${
                      item.status === "approved"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Address:</strong> {item.address || "----"}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    onClick={() =>
                      handleUpdateStatus({ item, status: "approved" })
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
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
      )}
    </div>
  );
};
