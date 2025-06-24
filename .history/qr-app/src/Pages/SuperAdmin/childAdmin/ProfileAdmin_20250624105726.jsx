import React, { useEffect, useState } from "react";
import image from "../../../../public/assets/image1.jpg";
import { Model } from "../../../components/Model";
import QRCode from "react-qr-code";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";
import { useRef } from "react";
export const ProfileAdmin = () => {
  const [QrCodeOpen, setOpenQrCodeModel] = useState(false);
  const [adminProfile, setAdminProfile] = useState({});
  const qrRef = useRef();
  const { id } = useParams();
  const frontendUri =
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

  function handleDownload() {
    const qrCanvas = document.getElementById("qr-canvas");
    if (!qrCanvas) return;

    const pngUrl = qrCanvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <div className="my-6 mx-2 ">
      <header className="flex flex-col gap-4 sm:flex-row justify-between items-center">
        <div className="flex gap-6">
          <img
            src={`${backendUrl}/${adminProfile?.avatar}`}
            alt="image"
            className="w-[80px] h-[80px] rounded-full"
          />
          <div className="flex flex-col justify-center text-gray-500">
            <h1>{`${adminProfile?.name}`}</h1>
            <p>{`${adminProfile?.email}`}</p>
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
            <div className="flex flex-col items-center gap-4">
              <QRCodeCanvas
                id="qr-canvas"
                value={`${frontendUri}/shop/${adminProfile._id}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download QR Code
              </button>
            </div>
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
              {`${adminProfile?.name}`}
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex      text-gray-500 mb-2">Email</h2>
            <p className=" px-8 py-2 rounded-xl pl-4 bg-gray-100 text-gray-700">
              {`${adminProfile?.email}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row my-2 w-full justify-between ">
          <div className="flex flex-col w-full">
            <h2 className="flex pl-2 text-gray-500 mb-2">Phone</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              {`${adminProfile?.phone}`}
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex  text-gray-500 mb-2">Address</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              {`${adminProfile?.address}`}
            </p>
          </div>
        </div>
        <div className=" text-gray-500 mb-2">
          Created User{" "}
          <p className="w-[48.5%] px-8 py-2 rounded-xl pl-4 bg-gray-100 text-gray-700">
            {`${adminProfile?.createdAt}`}
          </p>
        </div>
      </div>
    </div>
  );
};
