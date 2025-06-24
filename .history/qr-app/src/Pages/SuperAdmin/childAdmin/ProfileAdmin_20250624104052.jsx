import React, { useEffect, useState } from "react";
import image from "../../../../public/assets/image1.jpg";
import { Model } from "../../../components/Model";
import QRCode from "react-qr-code";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";
export const ProfileAdmin = () => {
  const [QrCodeOpen, setOpenQrCodeModel] = useState(false);
  const [adminProfile, setAdminProfile] = useState({});
  const { id } = useParams();
  const frontendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_FRONTEND_PROD
      : import.meta.env.VITE_FRONTEND_DEV;

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/auth/adminProfile", {
        params: {
          id: id,
        },
      });
      setAdminProfile(response.data.content);
    };
    fetched();
  }, []);
  console.log(id, adminProfile?.[0].avatar);
  return (
    <div className="my-6 mx-2 ">
      <header className="flex flex-col gap-4 sm:flex-row justify-between items-center">
        <div className="flex gap-6">
          <img
            // src={`${backendUrl}/${adminProfile?.[0].avatar}`}
            src={image}
            alt="image"
            className="w-[80px] h-[80px] rounded-full"
          />
          <div className="flex flex-col justify-center text-gray-500">
            <h1>Gaurav kumar</h1>
            <p>gorav.panwar@ggmail.com</p>
          </div>
        </div>
        <div
          className="bg-blue-100 px-6 w-fit h-10 flex justify-center items-center"
          onClick={() => setOpenQrCodeModel(true)}
        >
          Show QR Code
        </div>
        {QrCodeOpen && (
          <Model onClose={() => setOpenQrCodeModel(false)}>
            <QRCode
              // value={`${frontendUri}/shop/${admin._id}`}
              value={`name`}
              size={128}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </Model>
        )}

        <div>
          <button className="h-10 px-6 bg-blue-400 mr-10 text-white ">
            Edit
          </button>
        </div>
      </header>
      <div className="">
        <div className="flex flex-col gap-4 sm:flex-row my-2 w-full justify-between  ">
          <div className="flex flex-col w-full">
            <h2 className="flex pl-2 text-gray-500 mb-2">FullName</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              Gaurav kumar
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex      text-gray-500 mb-2">Email</h2>
            <p className=" px-8 py-2 rounded-xl pl-4 bg-gray-100 text-gray-700">
              Gaurav@test.com
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row my-2 w-full justify-between ">
          <div className="flex flex-col w-full">
            <h2 className="flex pl-2 text-gray-500 mb-2">Phone</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              +918077751497
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex  text-gray-500 mb-2">Address</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              Saharanpur naveen Nager
            </p>
          </div>
        </div>
        <div className=" text-gray-500 mb-2">
          Created User{" "}
          <p className="w-[48.5%] px-8 py-2 rounded-xl pl-4 bg-gray-100 text-gray-700">
            15/15/2025
          </p>
        </div>
      </div>
    </div>
  );
};
