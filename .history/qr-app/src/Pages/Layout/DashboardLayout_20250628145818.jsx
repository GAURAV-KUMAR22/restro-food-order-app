import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Edit2Icon } from "lucide-react";
import { logout } from "../../Redux/Fetures/authSlice";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminProfile = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [coverImageModel, setCoverImageModel] = useState(false);
  const [updatedCoverImage, setUpdatedCoverImage] = useState(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const uploadCoverImage = async () => {
    // Handle image upload logic here
  };

  const backendUrl 

  return (
    <div className="min-w-[375px] h-auto relative">
      {/* COVER IMAGE */}
      {adminProfile?.user?.coverImage ? (
        <img
          src={`${backendUrl}/${adminProfile.user.coverImage}`}
          alt="cover"
          className="w-full object-cover max-h-[250px]"
        />
      ) : (
        <img
          src="/assets/image1.jpg"
          alt="default cover"
          className="w-full object-cover max-h-[250px]"
        />
      )}

      {/* COVER IMAGE EDIT BUTTON */}
      <div className="absolute right-2 top-52">
        <button
          onClick={() => setCoverImageModel((prev) => !prev)}
          className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
        >
          <Edit2Icon size={20} />
        </button>
      </div>

      {/* COVER IMAGE MODAL */}
      {coverImageModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center rounded-md">
          <div
            className="absolute inset-0 drop-shadow-2xl bg-opacity-30 backdrop-blur-sm"
            onClick={() => setCoverImageModel(false)}
          ></div>
          <div className="absolute w-[600px] h-[300px] bg-white px-4 rounded-md">
            <h1 className="text-center mt-5 text-xl font-semibold">
              Update Cover Image
            </h1>
            <p className="text-center text-red-500 text-sm">
              Cover image should be in JPEG format. <br />
              <hr /> After update, re-login is required.
            </p>
            <div className="flex justify-center items-center mx-auto">
              <input
                type="file"
                onChange={(e) => setUpdatedCoverImage(e.target.files[0])}
                className="border mt-5 p-2"
              />
            </div>
            <button
              className="mt-10 border p-2 w-full bg-amber-400"
              onClick={uploadCoverImage}
            >
              Upload Image
            </button>
          </div>
        </div>
      )}

      {/* MENU */}
      <div className="absolute left-0 top-2">
        <button onClick={toggleMenu}>
          <Menu size={40} color="gray" />
        </button>
        {showMenu && (
          <div className="mt-2 bg-white shadow-lg rounded-md py-2 w-20 border">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT FROM ROUTES */}
      <div className="mt-5 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
