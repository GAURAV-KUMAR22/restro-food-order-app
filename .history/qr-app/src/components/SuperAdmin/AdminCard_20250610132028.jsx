import React from "react";

export const AdminCard = ({ item }) => {
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
              <button className="bg-green-400 p-2 px-2 rounded-lg text-white">
                Aprroved
              </button>
              <button className="bg-red-400 p-2 px-2 rounded-lg">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
