import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Edit2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "../../Redux/Fetures/authSlice";
import toast from "react-hot-toast";
import PrivateAxios from "../../Services/PrivateAxios";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminProfile = useSelector((state) => state.auth);

  const [showMenu, setShowMenu] = useState(false);
  const [coverImageModel, setCoverImageModel] = useState(false);
  const [updatedCoverImage, setUpdatedCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const resetModal = () => {
    setCoverImageModel(false);
    setUpdatedCoverImage(null);
    setUploadProgress(0);
  };

  const uploadCoverImage = async (e) => {
    e.preventDefault();

    if (!updatedCoverImage) {
      toast.error("Please select an image before uploading.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const form = new FormData();
    form.append("image", updatedCoverImage);

    try {
      const response = await PrivateAxios.post("/auth/CoverImage", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      if (response.status === 200) {
        setUploadProgress(100);
        toast.success("Cover image updated successfully!");

        setTimeout(() => {
          dispatch(
            loginSuccess({
              ...adminProfile,
              user: {
                ...adminProfile.user,
                coverImage: response.data.content.coverImage,
              },
            })
          );
          resetModal();
        }, 800);
      }
    } catch (error) {
      toast.error("Upload failed.");
      console.error("Cover image upload error:", error);
    } finally {
      setLoading(false);
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
            onClick={resetModal}
          ></div>
          <div className="relative z-10 w-[90%] max-w-[600px] bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-xl font-semibold text-center mb-2">
              Update Cover Image
            </h1>
            <p className="text-sm text-center text-red-500 mb-4">
              Only JPEG / Png / WEBP format is allowed.
            </p>
            <form
              onSubmit={uploadCoverImage}
              className="flex flex-col items-center gap-4"
            >
              <input
                type="file"
                accept="image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (
                    file &&
                    ![
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                      "image/jpg",
                    ].includes(file.type)
                  ) {
                    toast.error(
                      "Only JPEG, PNG, JPG, or WEBP files are allowed."
                    );
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

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-2 rounded-md w-full transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Menu Toggle */}
      <div className="absolute left-2 top-2">
        <button onClick={toggleMenu}>
          <Menu size={40} color="gray" />
        </button>
        {showMenu && (
          <div className="absolute mt-2 bg-white shadow-xl rounded-lg w-40 border border-gray-200 z-30 animate-fade-in">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              onClick={() => navigate("/admin/settings")}
            >
              ⚙️ Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* ✅ Main Content */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
