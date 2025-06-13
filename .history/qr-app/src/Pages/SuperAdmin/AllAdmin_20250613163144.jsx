import React from "react";
import { useEffect } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";
import { set } from "mongoose";
import { Link, useLocation } from "react-router-dom";

export const AllAdmin = ({ item }) => {
  const [admins, setAdmins] = useState([]);
  const location = useLocation();
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
        <h1 className="text-3xl text-gray-500 text-left font-bold mt-3">
          All Admins
        </h1>
      </div>
      <div className=" mt-3">
        <table className="table-auto w-[100%] text-left border border-collapse border-gray-500 shadow-md bg-gray-200">
          <thead className="text-gray-600 text-sm border-b mx-2">
            <tr>
              <th className="pt-2 px-4">Sr.</th>
              <th className="pt-2 px-4">Name</th>
              <th className="pt-2 px-4">Email</th>
              <th className="pt-2 px-4">Phone</th>
              <th className="pt-2 px-4">Address</th>
              <th className="pt-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {admins.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 ">
                <td className="capitalize py-3 px-4 flex items-center space-x-2 text-blue-500">
                  <Link to={`${location.pathname}/:${item._id}`}>
                    {" "}
                    {item._id}
                  </Link>
                </td>

                <td className="capitalize">{item.name}</td>
                <td>{item.email}</td>
                <td className=" pl-2">{item.phone ? item.phone : "Null"}</td>
                <td className=" pl-2">
                  {item.address ? item.address : "Null"}
                </td>
                <td className=" pl-2">
                  <button
                    className="bg-red-300 p-2  shadow-md
                  "
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
