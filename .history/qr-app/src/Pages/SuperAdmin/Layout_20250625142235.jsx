// components/superadmin/SuperAdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  LayoutDashboard,
  UsersIcon,
  UserPenIcon,
  SquareArrowDown,
  User2,
} from "lucide-react";
import { FaPauseCircle } from "react-icons/fa";
import { GoX } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../Redux/Fetures/authSlice";
import PrivateAxios from "../../Services/PrivateAxios";
import cross from "../../../public/assets/cross.png";
import { socket } from "../../Services/Socket";
import DropdownMenu from "../../components/SuperAdmin/DropDownMenu";

export const SuperAdminLayout = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [superadminProfile, setSuperAdminProfile] = useState(false);
  const [openComplaintModel, setOpenComplaintModel] = useState(false);
  const [updatedImage, setUpdatedImage] = useState();
  const [complaints, setComplaints] = useState([]);
  const [superadmin, setSuperAdmin] = useState();
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const superadminImage = useSelector((state) => state.auth.user.imageUrl);
  const superadminPro = useSelector((state) => state.auth.user);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    const fetchSuperAdmin = async () => {
      try {
        const response = await PrivateAxios.get("/auth/getSuperAdmin");
        if (response.status === 200) {
          setSuperAdmin(response.data.content);
        } else {
          toast.error("Failed to fetch superadmin info");
        }
      } catch (error) {
        toast.error("Error fetching superadmin info");
      }
    };
    fetchSuperAdmin();
  }, []);

  useEffect(() => {
    if (!token) navigate("/login/superadmin");
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.emit("join-superadmin");
    const fetchComplaints = async () => {
      try {
        const response = await PrivateAxios.get("/auth/complaint");
        if (response.status === 200) setComplaints(response.data.content);
        else toast.error("Failed to fetch complaints");
      } catch (error) {
        toast.error("Error fetching complaints");
      }
    };
    fetchComplaints();
    socket.on("complaint-receved", fetchComplaints);
    return () => socket.off("complaint-receved", fetchComplaints);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/superadmin/login");
    toast.success("Logged out");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name || superadmin?.[0]?.name || "");
    data.append("phone", form.phone || superadmin?.[0]?.phone || "");
    if (form.password) data.append("password", form.password);
    if (updatedImage) data.append("image", updatedImage);

    try {
      const response = await PrivateAxios.patch("/auth/updateSuperadmin", data);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        navigate("/superadmin");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Update error");
    }
  };

  const handleUpdateComplainStatus = async ({ id, status }) => {
    try {
      const response = await PrivateAxios.patch("/auth/complaint", {
        id,
        status,
      });
      if (response.status === 200) {
        socket.emit("complaint-resolve");
        toast.success("Complaint resolved");
      } else {
        toast.error("Failed to resolve complaint");
      }
    } catch (error) {
      toast.error("Resolve error");
    }
  };

  const sideBar = [
    { name: "Dashboard", pathName: "/superadmin", icon: LayoutDashboard },
    { name: "All Admins", pathName: "/superadmin/admin-list", icon: UsersIcon },
    {
      name: "Pending Admins",
      pathName: "/superadmin/pending-admin",
      icon: UserPenIcon,
    },
    {
      name: "Suspended Admins",
      pathName: "/superadmin/Suspended-admin",
      icon: FaPauseCircle,
    },
    {
      name: "Setting",
      pathName: "/superadmin/setting",
      icon: FaPauseCircle,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md min-h-screen relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 bg-blue-100 px-4 py-2 rounded-lg shadow-sm border-l-4 border-blue-500 tracking-wide">
          superadmin PANEL
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded-md"
          />
          <div
            onClick={() => setOpenComplaintModel(true)}
            className="relative cursor-pointer"
          >
            <BellIcon size={24} />
            {complaints.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {complaints.length}
              </span>
            )}
          </div>

          <div className="relative">
            <DropdownMenu
              user={superadminPro}
              onOpenProfile={() => setSuperAdminProfile(true)}
              complaintCount={complaints.length}
              onLogout={handleLogout}
              onOpenComplaints={() => setOpenComplaintModel(true)}
              superadminImage={superadminImage}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mb-4 bg-blue-400 text-black p-1.5 rounded-md">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.pathName}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
          ${
            isActive
              ? "bg-white text-blue-600 shadow"
              : "text-white hover:bg-blue-300 hover:text-black"
          }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="text-sm text-right text-gray-500">
        {currentDateTime.toLocaleDateString()}{" "}
        {currentDateTime.toLocaleTimeString()}
      </div>

      {openComplaintModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-md shadow-lg p-4 relative">
            <img
              src={cross}
              alt="close"
              className="absolute top-3 right-3 w-6 h-6 cursor-pointer"
              onClick={() => setOpenComplaintModel(false)}
            />
            <h2 className="text-xl font-semibold mb-4">Complaints</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {complaints.map((item) => (
                <div
                  key={item._id}
                  className="border p-3 rounded-md bg-gray-50"
                >
                  <p>
                    <strong>ID:</strong> {item._id}
                  </p>
                  <p>
                    <strong>Admin:</strong> {item.adminId?.name}
                  </p>
                  <p>
                    <strong>Detail:</strong> {item.complainDetail}
                  </p>
                  <p>
                    <strong>Subject:</strong> {item.subject}
                  </p>
                  <button
                    onClick={() =>
                      handleUpdateComplainStatus({
                        id: item._id,
                        status: "resolve",
                      })
                    }
                    className="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded-md"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {superadminProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md rounded-md shadow-lg p-6 relative">
            <GoX
              size={24}
              className="absolute top-3 right-3 text-red-500 cursor-pointer"
              onClick={() => setSuperAdminProfile(false)}
            />
            <h2 className="text-lg font-semibold mb-4 text-center">
              superadmin Profile
            </h2>
            <div className="flex items-center  justify-center mx-auto ">
              {superadminImage ? (
                <img
                  src={`${backendUrl}/${superadminImage}`}
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover"
                />
              ) : (
                <User2 size={24} />
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border p-2 rounded w-full"
                value={form.name || superadmin?.[0]?.name || ""}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-2 rounded w-full"
                onChange={handleChange}
              />
              <input
                type="file"
                className="border p-2 rounded w-full"
                onChange={(e) => setUpdatedImage(e.target.files[0])}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="border p-2 rounded w-full"
                value={form.phone || superadmin?.[0]?.phone || ""}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-600"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};
