import React from "react";

export const AdminCard = () => {
  return (
    <div className="mt-3">
      <table className="table-auto w-[98%]">
        <thead className="w-[98%] ">
          <tr>
            <th>#Id</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="w-[98%]">
          <tr>
            <td>455 5</td>
            <td>New SHop</td>
            <td>
              <button>Aprroved</button>
              <button>Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
