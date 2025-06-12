import React from "react";

export const AdminCard = ({ item }) => {
  function handleAprovedUpdate(admin) {}
  return (
    <div className="mt-3 mx-5">
      <table className="table-fixed w-[98%] text-left">
        <thead className="w-[98%] ">
          <tr>
            <th>#Id</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="w-[98%]">
          <tr>
            <td>{item._id}</td>
            <td>{item.name}</td>
            <td className="space-x-3">
              <button
                className="bg-green-400 p-2 px-2 rounded-lg text-white"
                onClick={() => handleAprovedUpdate(item)}
              >
                Aprroved
              </button>
              <button
                className="bg-red-400 p-2 px-2 rounded-lg"
                onClick={() => handleUpdateReject(item)}
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
