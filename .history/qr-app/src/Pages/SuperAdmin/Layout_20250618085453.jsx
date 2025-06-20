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
export const SuperAdminLayout = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [superadminProfile, setSuperAdminProfile] = useState(false);
  const [openComplaintModel, setOpenComplaintModel] = useState(true);
  const [updatedImage, setUpdatedImage] = useState();
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

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login/superadmin");
  };

  const sideBar = [
    { name: "Dashboard", pathName: "/superAdmin", icon: LayoutDashboard },
    { name: "All Admins", pathName: "/superAdmin/admin-list", icon: UsersIcon },
    {
      name: "Pending Admins",
      pathName: "/superAdmin/pending-admin",
      icon: UserPenIcon,
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
  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-screen relative">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 px-2 font-semibold">
        <h2 className="font-bold text-gray-400 italic text-2xl">
          SUPERADMIN PANEL
        </h2>
        <div className="flex space-x-4 h-10 items-center">
          <input
            type="text"
            placeholder="Search name, email, etc."
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
          />
          <BellIcon size={25} />
          <div>
            {superadminImage ? (
              <img
                src={`${backendUrl}/${superadminImage}`}
                alt="image"
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <User2 size={25} />
            )}
          </div>
          <div className="relative flex items-center space-x-2">
            <h1 className="text-sm font-medium text-black">
              {superadminPro.name}
            </h1>
            <button onClick={superadminManegeFuncton}>
              <SquareArrowDown size={25} />
            </button>

            {superAdminManage && (
              <div className="absolute top-10 right-0 w-40 bg-white shadow-lg rounded-md z-10 py-2">
                <ul className="flex flex-col space-y-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setSuperAdminProfile(true)}
                    >
                      User
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpenComplaintModel((prev) => !prev)}
                    >
                      Complaints
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2  bg-red-500 text-white hover:bg-red-600 rounded-md"
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

      {/* Complaints */}

      {openComplaintModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute justify-center items-center drop-shadow-2xl"></div>
          <div className="w-[700px] h-[500px] ">
            <h1 className="text-2xl text-gray-500 font-semibold">Complaint</h1>
          </div>
        </div>
      )}

      {/* Menu Bar */}
      <div className="flex bg-gray-200 h-10 my-2 items-center space-x-6">
        {superadminProfile && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="relative w-[500px] bg-white rounded-xl shadow-xl p-6">
              {/* Close Button */}
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
                {/* Avatar Preview */}
                <div className="flex justify-center items-center w-[150px] h-[150px] mx-auto rounded-full bg-gray-200 overflow-hidden">
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

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="border p-2 rounded w-full"
                    placeholder="Name"
                    value={form.name || superadmin?.[0]?.name || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="border p-2 rounded w-full"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>

                {/* Image */}
                <div>
                  <label htmlFor="image" className="block">
                    Avatar
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="border p-2 rounded w-full"
                    onChange={(e) => setUpdatedImage(e.target.files[0])}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="border p-2 rounded w-full"
                    placeholder="Phone Number"
                    value={form.phone || superadmin?.[0]?.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
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

        {sideBar.map((item, index) => {
          const isActive = location.pathname === item.pathName;
          location.pathname.includes("admin-list");
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.pathName}
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-400 text-white"
                  : "text-[#2C333B] hover:bg-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Clock */}
      <div className="bg-[#2C333B] text-white w-fit px-2 h-10 flex items-center  rounded-lg my-2">
        Date {currentDateTime.toLocaleDateString()} Time{" "}
        {currentDateTime.toLocaleTimeString()}
      </div>

      {/* Page Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};
