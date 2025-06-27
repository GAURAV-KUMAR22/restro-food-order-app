// components/SuperAdmin/SuperAdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  LayoutDashboard,
  User2Icon,
  UsersIcon,
  UserPenIcon,
  SquareArrowDown,
  User2,
} from "lucide-react";
import { GoX } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../Redux/Fetures/authSlice";
import PrivateAxios from "../../Services/PrivateAxios";
import cross from "../../../public/assets/cross.png";
import { socket } from "../../Services/Socket";
import { FaPauseCircle } from "react-icons/fa";
export const SuperAdminLayout = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [superadminProfile, setSuperAdminProfile] = useState(false);
  const [openComplaintModel, setOpenComplaintModel] = useState(false);
  const [updatedImage, setUpdatedImage] = useState();
  const [complaints, setComplaints] = useState([]);
  const [superadmin, setSuperAdmin] = useState();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [superAdminManage, setSuperAdminMange] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const superadminImage = useSelector((state) => state.auth.user.imageUrl);
  const superadminPro = useSelector((state) => state.auth.user);

  // getSuperAdmin
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/auth/getSuperAdmin");
      console.log(response);
      if (response.status === 200) {
        setSuperAdmin(response.data.content);
      } else {
        toast.error("responce Failed");
      }
    };
    fetched();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login/superadmin");
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date(Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // getComplaints
  useEffect(() => {
    socket.emit("join-superadmin");
    const fetched = async () => {
      const response = await PrivateAxios.get("/auth/complaint");
      if (response.status !== 200) {
        toast.error("responce Failed");
      }

      setComplaints(response.data.content);
    };

    fetched();
    socket.on("complaint-receved", () => {
      fetched();
    });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/superadmin/login");
    toast.success("Logged out");
  };

  const sideBar = [
    { name: "Dashboard", pathName: "/superAdmin", icon: LayoutDashboard },
    { name: "All Admins", pathName: "/superAdmin/admin-list", icon: UsersIcon },
    {
      name: "Pending Admins",
      pathName: "/superAdmin/pending-admin",
      icon: UserPenIcon,
    },
    {
      name: "Suspended Admins",
      pathName: "/superAdmin/Suspended-admin",
      icon: FaPauseCircle,
      className: "text-red-500",
    },
  ];
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  function superadminManegeFuncton() {
    setSuperAdminMange((prev) => !prev);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    if (form.name) {
      data.append("name", form.name);
    } else if (superadmin?.[0]?.name) {
      data.append("name", superadmin[0].name);
    }

    if (form.phone) {
      data.append("phone", form.phone);
    } else if (superadmin?.[0]?.phone) {
      data.append("phone", superadmin[0].phone);
    }

    if (form.password) {
      data.append("password", form.password);
    }

    if (updatedImage) {
      data.append("image", updatedImage);
    }
    const respnose = await PrivateAxios.patch("/auth/updateSuperadmin", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!respnose.status === 200) {
      return toast.error("responce failed");
    }
    navigate("/superAdmin");
    toast.success("Profile Successfully updated");
  }
  async function handleUpdateComplainStatus(data) {
    socket.emit("join-superadmin");
    try {
      const response = await PrivateAxios.patch("/auth/complaint", data);
      if (response.status !== 200) {
        toast.error(`response Failed  ${response.status}`);
      }
      socket.emit("complaint-resolve");
      toast.success("Complaint resolve Successfully");
    } catch (error) {
      toast.error(`response Failed  ${response.status}`);
    }
  }
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md min-h-screen relative">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-2 font-semibold">
        <h2 className="font-bold text-gray-400 italic text-xl md:text-2xl">
          SUPERADMIN PANEL
        </h2>

        <div className="flex flex-wrap gap-2 md:gap-4 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search name, email, etc."
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring focus:border-blue-300"
          />

          {/* Bell */}
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenComplaintModel(true)}
          >
            <BellIcon size={25} />
            {complaints.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                {complaints.length}
              </span>
            )}
          </div>

          {/* Profile */}
          <div>
            {superadminImage ? (
              <img
                src={`${backendUrl}/${superadminImage}`}
                alt="image"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User2 size={25} />
            )}
          </div>

          {/* Dropdown */}
          <div className="relative flex items-center space-x-2">
            <h1 className="text-sm font-medium text-black truncate max-w-[100px]">
              {superadminPro.name}
            </h1>
            <button onClick={superadminManegeFuncton}>
              <SquareArrowDown size={25} />
            </button>

            {superAdminManage && (
              <div className="absolute top-12 right-0 w-48 bg-white shadow-xl rounded-lg z-50 py-2 border border-gray-100">
                <ul className="flex flex-col">
                  <li>
                    <button className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSuperAdminProfile(true)}
                      className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      User
                    </button>
                  </li>
                  <li className="relative">
                    <button
                      onClick={() => setOpenComplaintModel((prev) => !prev)}
                      className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      Complaints
                      {complaints.length > 0 && (
                        <span className="absolute top-2.5 right-4 h-5 w-5 bg-red-500 text-white text-xs font-semibold flex items-center justify-center rounded-full">
                          {complaints.length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <Link
                      to={`${location.pathname}/setting`}
                      className="w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      Settings
                    </Link>
                  </li>
                  <li className="mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-2 bg-red-500 text-white hover:bg-red-600 text-sm rounded-b-md"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      {openComplaintModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm px-2">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white shadow-2xl rounded-lg overflow-y-auto p-4">
            <img
              src={cross}
              alt="close"
              className="absolute right-2 top-2 w-[35px] h-[35px] cursor-pointer"
              onClick={() => setOpenComplaintModel(false)}
            />
            <h1 className="text-2xl text-gray-700 font-semibold text-center py-4 border-b">
              Complaints
            </h1>
            <div className="space-y-4 py-4">
              {complaints.map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 bg-gray-100 rounded shadow"
                >
                  <p className="font-medium flex justify-between text-sm">
                    CreatedAt:{" "}
                    <span className="font-normal">{item.createdAt}</span>
                    <button
                      className="bg-red-500 px-3 py-1 rounded-xl text-white text-xs"
                      onClick={() =>
                        handleUpdateComplainStatus({
                          id: item._id,
                          status: "resolve",
                        })
                      }
                    >
                      Solved
                    </button>
                  </p>
                  <p className="text-sm">
                    <strong>Complaint ID#:</strong> {item._id}
                  </p>
                  <p className="text-sm">
                    <strong>Admin ID:</strong> {item.adminId._id}
                  </p>
                  <p className="text-sm">
                    <strong>Admin Name:</strong> {item.adminId.name}
                  </p>
                  <p className="text-sm">
                    <strong>Detail:</strong> {item.complainDetail}
                  </p>
                  <p className="text-sm">
                    <strong>Subject:</strong> {item.subject}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-500">
                      View Snapshot
                    </summary>
                    <Link to={`${backendUrl}/${item.snapshot}`} target="_blank">
                      <img
                        src={`${backendUrl}/${item.snapshot}`}
                        alt="Snapshot"
                        className="mt-2 w-full rounded"
                      />
                    </Link>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Bar */}
      <div className="flex flex-wrap bg-gray-200 min-h-[3rem] my-2 items-center gap-2 p-2 rounded-md">
        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          const Icon = item.icon;
          return (
            <>
              <Link
                key={index}
                to={item.pathName}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm ${
                  isActive
                    ? "bg-blue-400 text-white"
                    : "text-[#2C333B] hover:bg-gray-300"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.className}`} />
                <span>{item.name}</span>
              </Link>
            </>
          );
        })}
        <div className="bg-[#2C333B] text-white w-fit px-2 h-10 flex items-center rounded-lg my-2 text-sm">
          Date {currentDateTime.toLocaleDateString()} Time{" "}
          {currentDateTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Profile Modal */}
      {superadminProfile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-2">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6">
            <button onClick={() => setSuperAdminProfile(false)}>
              <GoX
                size={25}
                className="absolute text-red-600 right-2 top-2 cursor-pointer"
              />
            </button>
            <h1 className="text-center text-blue-500 font-semibold text-xl border-b pb-2 mb-4">
              SuperAdmin Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
                <div className="w-[120px] h-[120px] bg-gray-200 rounded-full overflow-hidden">
                  {updatedImage ? (
                    <img
                      src={URL.createObjectURL(updatedImage)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : superadmin?.[0]?.avatar ? (
                    <img
                      src={`${backendUrl}/${superadmin[0].avatar}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User2 size={80} />
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  className="border p-2 rounded w-full"
                  placeholder="Name"
                  value={form.name || superadmin?.[0]?.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="border p-2 rounded w-full"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="image">Avatar</label>
                <input
                  type="file"
                  className="border p-2 rounded w-full"
                  onChange={(e) => setUpdatedImage(e.target.files[0])}
                />
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="border p-2 rounded w-full"
                  placeholder="Phone Number"
                  value={form.phone || superadmin?.[0]?.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};
