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

  

  const profile = useSelector((state)=>state.auth.user)

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
      <div>
        <h1 className="text-2xl text-center my-5 font-semibold text-gray-500 flex justify-center items-center gap-3.5 ">
          Admin Settings
          <span>
            <SettingsIcon size={30} />
          </span>
        </h1>
        <div className="flex flex-wrap gap-5  items-center  mx-20  w-[90%] h-50 my-10">
          <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
            <button onClick={() => setProfileModel((prev) => !prev)}>
              <h1>Profile</h1>
            </button>
          </div>
          <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
            <button onClick={() => setRaiseComplaintModel((prev) => !prev)}>
              <h1>Raise Complaints</h1>
            </button>
          </div>
          <div className="w-[240px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
            <button>
              <h1 className="inline">Raise Complaints status</h1>
            </button>
          </div>
        </div>
        {profileModel && (
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="absolute inset-0 drop-shadow-2xl bg-opacity-30 backdrop-blur-sm"></div>
            <div className="absolute w-[600px] h-[500px] bg-white px-4">
              <h1 className="text-2xl font-semibold text-gray-500 text-center">
                Admin Profile
              </h1>
              <div>
                <div className="flex justify-center items-center mx-auto">
                    <img src={ profile.coverImage} alt="adminImage" />
                </div>
              </div>
            </div>
          </div>
        )}
        {raiseComplaintModel && (
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="absolute inset-0 drop-shadow-2xl bg-opacity-30 backdrop-blur-sm"></div>
            <div className="absolute w-[600px] h-[500px] bg-white px-4">
              <button
                className="absolute right-0 top-2"
                onClick={() => setRaiseComplaintModel((prev) => !prev)}
              >
                <img
                  src={crossSign}
                  alt="cross"
                  className="w-[40px] h-[40px]"
                />
              </button>

              <form onSubmit={handleSubmit}>
                <h1 className="text-2xl text-center my-4 font-semibold text-gray-600">
                  Complaint Form
                </h1>

                <div className="flex space-x-6 w-[100%] ">
                  <div className="flex flex-col w-1/2 mb-2">
                    <label htmlFor="date" className="mb-2">
                      Complaint Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      onChange={handleChange}
                      className="border p-2 border-gray-600 text-gray-600 "
                    />
                  </div>
                  <div className="flex flex-col w-1/2 mb-2">
                    <label htmlFor="time" className="mb-2">
                      {" "}
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      onChange={handleChange}
                      className="border p-2 border-gray-600 text-gray-600 "
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
                    className=" border border-gray-600 p-2"
                    placeholder="Ui releted, Login Signup issue"
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label htmlFor="snapshot" className="mb-2">
                    Snapshot
                  </label>
                  <input
                    type="file"
                    name="file"
                    id=""
                    onChange={(e) => setSnapshopImages(e.target.files[0])}
                    className="border border-gray-600 p-2"
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
                    className="border border-gray-600 p-2"
                    placeholder="explain...."
                  />
                </div>
                <button className="bg-blue-300 w-full p-2 text-xl font-semibold">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
