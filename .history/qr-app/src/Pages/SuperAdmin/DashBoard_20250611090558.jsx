// import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import { AdminCard } from "../../components/SuperAdmin/AdminCard";
// import publicAxios from "../../Services/PublicAxios";
// import { set } from "mongoose";
// import PrivateAxios from "../../Services/PrivateAxios";
// import { Sidebar } from "../../components/SuperAdmin/Sidebar";
// import { Home, LayoutDashboard } from "lucide-react";
// import { Link } from "react-router-dom";
// import icons from "../../../public/assets/saled.webp";

// export const DashBoard = () => {
//   const [pendingAdmins, setpendingAdmins] = useState([]);
//   const sideBar = [
//     { name: "Dashboard", icon: <LayoutDashboard size={15} /> },
//     { name: "Products" },
//     { name: "Categorys" },
//     { name: "Admin" },
//     { name: "Users" },
//   ];

//   useEffect(() => {
//     const fetched = async () => {
//       const responce = await PrivateAxios.get("/auth/pending-admin");
//       if (responce) {
//         setpendingAdmins(responce.data.content);
//       }
//     };
//     fetched();
//   }, []);

//   return (
//     <div>
//       <div className="bg-blue-200 flex items-center justify-between px-4 py-2">
//         {/* Title Section */}
//         <h1 className="text-2xl font-semibold w-1/5 flex  items-center">
//           SuperAdmin
//         </h1>

//         {/* Navigation & Avatar Section */}
//         <div className="flex items-center space-x-6 w-4/5 justify-between">
//           {/* Navigation Links */}
//           <div className="flex space-x-4 items-baseline-last">
//             <Link className="text-blue-700 hover:underline">All Admin</Link>
//             <Link className="text-blue-700 hover:underline">
//               Pending Approval
//             </Link>
//           </div>

//           {/* Avatar */}
//           <div>
//             <img
//               src={icons}
//               alt="avatar"
//               className="rounded-full w-[70px] h-[70px] object-cover"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-row">
//         <div className=" w-1/5 h-[100vh]">
//           <h1 className="flex justify-start text-2xl px-3">Menu</h1>
//           {sideBar.map((item, index) => (
//             <Sidebar item={item} />
//           ))}
//         </div>
//         <div className=" w-full">
//           <div className="grid grid-cols-4 space-x-3 mt-3 px-3 ">
//             <div className="bg-gray-200 h-25">
//               <Link to={`/superAdmin/admin-list`}>
//                 <h1 className="text-blue-600 text-center text-xl font-semibold">
//                   All Admins
//                 </h1>
//               </Link>
//             </div>
//             <div className="bg-gray-200 h-25">
//               <Link to={`/superAdmin/pending-admin`}>
//                 <h1 className="text-blue-600 text-center text-xl font-semibold">
//                   Pending Admins
//                 </h1>
//               </Link>
//             </div>
//             <div className="bg-gray-200 h-25">
//               <Link>
//                 <h1 className="text-blue-600 text-center text-xl font-semibold">
//                   All Admins
//                 </h1>
//               </Link>
//             </div>
//             <div className="bg-gray-200 h-25">
//               <Link>
//                 <h1 className="text-blue-600 text-center text-xl font-semibold">
//                   All Admins
//                 </h1>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

//  <div>
//         {pendingAdmins.map((item, index) => (
//           <AdminCard item={item} />
//         ))}
//       </div>

import React from "react";
import { Edit, Trash2 } from "lucide-react";

const guests = [
  {
    name: "Albert Flores",
    email: "flores@gmail.com",
    phone: "(+62)22-8765-5678",
    status: "Come in",
    address: "South Jakarta, Jakarta",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    name: "Wade Warren",
    email: "wade@gmail.com",
    phone: "(+62)29-1234-8767",
    status: "Come in",
    address: "Central Jakarta, Jakarta",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Ronald Richards",
    email: "ronald@gmail.com",
    phone: "(+62)25-1321-9076",
    status: "Not Come",
    address: "Banten, Banten",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  // Add more entries as needed
];

export const DashBoard = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Guest List</h2>
        <input
          type="text"
          placeholder="Search name, email, etc."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64"
        />
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="text-gray-500 text-sm">
          <tr>
            <th className="py-2 px-4">
              <input type="checkbox" />
            </th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Contact</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Address</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {guests.map((guest, index) => (
            <tr key={index} className="border-t">
              <td className="py-3 px-4">
                <input type="checkbox" />
              </td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <img
                  src={guest.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-gray-500 text-xs">
                    {guest.name.split(" ")[0]}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>{guest.email}</div>
                <div className="text-gray-500 text-xs">{guest.phone}</div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    guest.status === "Come in"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {guest.status}
                </span>
              </td>
              <td className="py-3 px-4">{guest.address}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Showing 1 to 8 of 230 entries</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded">{"<"}</button>
          <button className="px-3 py-1 bg-black text-white rounded">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
          <button className="px-3 py-1 border rounded">...</button>
          <button className="px-3 py-1 border rounded">230</button>
          <button className="px-3 py-1 border rounded">{">"}</button>
        </div>
      </div>
    </div>
  );
};
