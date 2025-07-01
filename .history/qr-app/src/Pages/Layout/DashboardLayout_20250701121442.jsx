import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Edit2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Fetures/authSlice";
import toast from "react-hot-toast";

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
    if (!updatedCoverImage) {
      toast.error("Please select an image.");
      return;
    }

    const form = new FormData();
    form.append("image", updatedCoverImage);

    try {
      // TODO: Replace with your API call (e.g. PrivateAxios.post("/auth/CoverImage", form))
      toast.success("Image uploaded (stub)");
      setCoverImageModel(false);
      setUpdatedCoverImage(null);
    } catch (err) {
      toast.error("Upload failed.");
      console.error("Upload error:", err);
    }
  };

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const coverImageUrl = adminProfile?.user?.coverImage
    ? `${backendUrl}/${adminProfile.user.coverImage}`
    : "/assets/image1.jpg";

  return (
    <div className="min-w-[375px] h-auto relative">
      {/* ✅ Cover Image */}
      <img
        src={coverImageUrl}
        alt="cover"
        className="w-full object-cover max-h-[250px]"
      />

      {/* ✅ Edit Button */}
      <div className="absolute right-2 top-[200px]">
        <button
          onClick={() => setCoverImageModel(true)}
          className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
        >
          <Edit2Icon size={20} />
        </button>
      </div>

      {/* ✅ Modal for Cover Image Upload */}
      {coverImageModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setCoverImageModel(false)}
          ></div>
          <div className="relative z-10 w-[90%] max-w-[600px] bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-xl font-semibold text-center mb-2">
              Update Cover Image
            </h1>
            <p className="text-sm text-center text-red-500 mb-4">
              Only JPEG format is allowed. You must re-login after update.
            </p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                accept="image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type !== "image/jpeg") {
                    toast.error("Only JPEG files are allowed.");
                    return;
                  }
                  setUpdatedCoverImage(file);
                }}
                className="border p-2 w-full rounded"
              />
              {updatedCoverImage && (
                <img
                  src={URL.createObjectURL(updatedCoverImage)}
                  alt="preview"
                  className="mt-2 max-h-[120px] rounded border"
                />
              )}
              <button
                onClick={uploadCoverImage}
                className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-2 rounded-md w-full transition"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Menu Toggle */}
      <div className="absolute left-2 top-2">
        <button onClick={toggleMenu}>
          <Menu size={40} color="gray" />
        </button>
        {showMenu && (
          <div className="mt-2 bg-white shadow-lg rounded-md py-2 w-24 border z-20">
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

      {/* ✅ Main Content */}
      <div className="mt-5 px-4 pb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
