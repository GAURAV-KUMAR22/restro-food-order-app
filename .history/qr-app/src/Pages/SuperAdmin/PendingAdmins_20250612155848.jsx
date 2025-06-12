import React, { useEffect, useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { Edit, Trash2 } from "lucide-react";

export const PendingAdmins = () => {
  const [pendingAdmins, setpendingAdmins] = useState([]);

  const BackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    const fetched = async () => {
      const responce = await PrivateAxios.get("/auth/pending-admin");
      if (responce) {
        setpendingAdmins(responce.data.content);
      }
    };
    fetched();
  }, []);

  async function handleUpdateStatus(items) {
    try {
      const data = { _id: items.item._id, status: items.status };
      setLoading(true);
      const responce = await PrivateAxios.patch("/auth/update/admin", data);
      if (responce.status === 200) {
        toast.success("successfully update");
      }
      setLoading(false);
    } catch (error) {
      toast.error("responce Failed");
      setLoading(false);
    }
  }

  return (
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
        {pendingAdmins.map((item, index) => (
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
                <div className="text-gray-500 text-xs">
                  {item.name?.split(" ")[0]}
                </div>
              </div>
            </td>

            <td className="py-3 px-4">
              <div>{item.email}</div>
              <div className="text-gray-500 text-xs">{item.phone}</div>
            </td>

            <td className="py-3 px-4 text-blue-500">
              {item.isApproved ? "ACTIVE" : "INACTIVE"}
            </td>

            <td className="py-3 px-4">{item.address}</td>

            <td className="space-x-3 space-y-2 pl-5">
              <button
                className="p-2 bg-green-400"
                onClick={() => handleUpdateStatus({ item, status: "approved" })}
              >
                Approved
              </button>
              <button
                className="p-2 bg-gray-400"
                onClick={() => handleUpdateStatus({ item, status: "reject" })}
              >
                Rejected
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
