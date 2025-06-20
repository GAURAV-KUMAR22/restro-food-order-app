import axios from "axios";
import { SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import crossSign from "../../../public/assets/cross.png";
import { socket } from "../../Services/Socket";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { useSelector } from "react-redux";
import cross from "../../../public/assets/cross.png";
import { Modal } from "../../components/Admin/Model";

export const Settings = () => {
  const [snapShopImages, setSnapshopImages] = useState();
  const [raiseComplaintModel, setRaiseComplaintModel] = useState(false);
  const [coverImageModel, setCoverImageModel] = useState(false);
  const [profileModel, setProfileModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    subject: "",
    complain: "",
  });

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const profile = useSelector((state) => state.auth.user);

  if (loading) {
    <div className="flex justify-center items-center">
      <ImSpinner9 className="animate-spin" size={70} />
    </div>;
  }

  const navigate = useNavigate();
  async function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const Form = new FormData();
    Form.append("date", form.date);
    Form.append("time", form.time);
    Form.append("subject", form.subject);
    Form.append("complain", form.complain);
    Form.append("image", snapShopImages);

    const response = await PrivateAxios.post("/auth/complaint", Form, {
      headers: { "Content-type": "multipart/form-data" },
    });

    if (response.status === 201) {
      socket.emit("join-superadmin");
      toast.success("complaint raise successfully");
      socket.emit("complaint-raise");
      navigate("/admin");
    }
    setLoading(false);
  }

  return (
    <div>
      <ReverseButton routeName={"Admin"} route={"/admin"} />

      <h1 className="text-2xl text-center my-5 font-semibold text-gray-500 flex justify-center items-center gap-3.5">
        Admin Settings <SettingsIcon size={30} />
      </h1>

      <div className="flex flex-wrap gap-5 mx-20 w-[90%] h-50 my-10">
        <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
          <button onClick={() => setProfileModel(true)}>
            <h1>Profile</h1>
          </button>
        </div>
        <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
          <button onClick={() => setRaiseComplaintModel(true)}>
            <h1>Raise Complaints</h1>
          </button>
        </div>
        <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
          <button>
            <h1 className="inline">Raise Complaints Status</h1>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={profileModel}
        onClose={() => setProfileModel(false)}
        title="Admin Profile"
      >
        <div className="flex flex-col items-center">
          <img
            src={`${backendUrl}/${profile.coverImage}`}
            alt="Admin"
            className="w-[80px] h-[80px] rounded-full object-cover border border-gray-300 mb-4"
          />
          <label className="text-gray-500 text-sm font-medium mb-1">Name</label>
          <p className="text-gray-700 text-xl font-semibold">{profile.name}</p>
        </div>
      </Modal>

      {/* Raise Complaint Modal */}
      <Modal
        isOpen={raiseComplaintModel}
        onClose={() => setRaiseComplaintModel(false)}
        title="Complaint Form"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-6">
            <div className="flex flex-col w-1/2 mb-2">
              <label htmlFor="date" className="mb-2">
                Complaint Date
              </label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="border p-2 border-gray-600 text-gray-600"
              />
            </div>
            <div className="flex flex-col w-1/2 mb-2">
              <label htmlFor="time" className="mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                onChange={handleChange}
                className="border p-2 border-gray-600 text-gray-600"
              />
            </div>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="subject" className="mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              onChange={handleChange}
              className="border p-2 border-gray-600"
              placeholder="UI related, Login Signup issue"
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="snapshot" className="mb-2">
              Snapshot
            </label>
            <input
              type="file"
              name="file"
              onChange={(e) => setSnapshopImages(e.target.files[0])}
              className="border p-2 border-gray-600"
            />
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="issue" className="mb-2">
              Explain complaint
            </label>
            <input
              type="text"
              name="complain"
              onChange={handleChange}
              className="border p-2 border-gray-600"
              placeholder="Explain..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-300 w-full p-2 text-xl font-semibold"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};
