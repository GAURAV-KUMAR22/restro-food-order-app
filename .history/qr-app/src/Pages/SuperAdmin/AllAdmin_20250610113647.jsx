import React from "react";

export const AllAdmin = ({ item }) => {
  return (
    <div>
      <div>
        <h1 className="text-3xl text-center font-bold mt-3">All Admins</h1>
      </div>
      <div>
        <table className="table-fixed border border-collapse border-gray-500">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <button>Approved</button>
                <button>Rejected</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
