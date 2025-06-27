import React, { useEffect, useRef, useState } from "react";
import { SquareArrowDown, User2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DropdownMenu = ({
  user,
  imageUrl,
  complaintCount,
  onLogout,
  onOpenComplaints,
  onOpenProfile,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  return (
    <div className="relative flex items-center space-x-2" ref={dropdownRef}>
      <h1 className="text-sm font-medium text-black truncate max-w-[100px]">
        {user?.name || "SuperAdmin"}
      </h1>
      <button onClick={() => setOpen((prev) => !prev)}>
        <SquareArrowDown size={25} />
      </button>

      {open && (
        <div className="absolute top-12 right-0 w-48 bg-white shadow-xl rounded-lg z-50 py-2 border border-gray-100">
          <ul className="flex flex-col">
            <li>
              <button className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700">
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={onOpenProfile}
                className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                User
              </button>
            </li>
            <li className="relative">
              <button
                onClick={onOpenComplaints}
                className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                Complaints
                {complaintCount > 0 && (
                  <span className="absolute top-2.5 right-4 h-5 w-5 bg-red-500 text-white text-xs font-semibold flex items-center justify-center rounded-full">
                    {complaintCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <Link
                to={`/superadmin/setting`}
                className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                Settings
              </Link>
            </li>
            <li className="mt-2">
              <button
                onClick={onLogout}
                className="w-full text-left px-5 py-2 bg-red-500 text-white hover:bg-red-600 text-sm rounded-b-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
