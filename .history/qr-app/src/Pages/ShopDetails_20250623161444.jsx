import React, { useEffect, useState } from "react";
import publicAxios from "../Services/PublicAxios";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

export const ShopDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await publicAxios.get("/auth/admins");
        console.log(response);
        setAdmins(response.data.content || []);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    }
    fetchAdmins();
  }, []);

  const handleAdminClick = (adminId) => {
    setSelectedAdminId((prevId) => (prevId === adminId ? null : adminId));
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <h1 className="w-full bg-gray-500 flex justify-center items-center text-2xl m-1">
        Shop Name
      </h1>
      {admins.length > 0 ? (
        admins.map((admin) => (
          <ul key={admin._id}>
            <li className="flex flex-col items-center">
              <button
                className="p-2 m-2 w-40 bg-amber-300 capitalize"
                onClick={() => handleAdminClick(admin._id)}
              >
                {admin.name}
              </button>
              <Link
                to={`/shop/${admin._id}`}
                className="text-blue-600 underline"
              >
                {`${backendUrl}/shop/${admin._id}`}
              </Link>
              {selectedAdminId === admin._id && (
                <div className="mt-4">
                  <QRCode
                    value={`http://localhost:5173/${admin._id}`}
                    size={128}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
            </li>
          </ul>
        ))
      ) : (
        <p>No admins available.</p>
      )}
    </div>
  );
};
