import React, { useEffect, useState, useRef } from "react";
import image from "../../../../public/assets/image1.jpg";
import { QRCodeSVG } from "qrcode.react"; // ✅ updated import
import { Model } from "../../../components/Model";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

export const ProfileAdmin = () => {
  const [QrCodeOpen, setOpenQrCodeModel] = useState(false);
  const [adminProfile, setAdminProfile] = useState({});
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
  }, [id]);

  function handleDownload() {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  }

  return (
    <div className="my-6  bg-gray-100 p-4">
      <header className="flex flex-col gap-4 sm:flex-row justify-between items-center">
        <div className="flex gap-6">
          <img
            src={`${backendUrl}/${adminProfile?.avatar}`}
            alt="profile"
            className="w-[80px] h-[80px] rounded-full object-cover"
          />
          <div className="flex flex-col justify-center text-gray-500">
            <h1>{adminProfile?.name}</h1>
            <p>{adminProfile?.email}</p>
          </div>
        </div>

        <div
          className="bg-blue-100 px-6 h-10 flex justify-center items-center cursor-pointer"
          onClick={() => setOpenQrCodeModel(true)}
        >
          Show QR Code
        </div>

        <div>
          <button className="h-10 px-6 bg-blue-400 mr-10 text-white">
            Edit
          </button>
        </div>
      </header>

      {QrCodeOpen && (
        <Model onClose={() => setOpenQrCodeModel(false)}>
          <div className="flex flex-col items-center gap-4">
            <QRCodeSVG
              id="qr-code-svg"
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

      <div className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row w-full justify-between">
          <div className="w-full">
            <h2 className="text-gray-500 mb-2">Full Name</h2>
            <p className="py-2 rounded-xl bg-gray-100 text-gray-700">
              {adminProfile?.name}
            </p>
          </div>
          <div className="w-full">
            <h2 className="text-gray-500 mb-2">Email</h2>
            <p className="py-2 rounded-xl  bg-gray-100 text-gray-700">
              {adminProfile?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row w-full justify-between mt-4">
          <div className="w-full">
            <h2 className="text-gray-500 mb-2">Phone</h2>
            <p className="py-2 rounded-xl  bg-gray-100 text-gray-700">
              {adminProfile?.phone}
            </p>
          </div>
          <div className="w-full">
            <h2 className="text-gray-500 mb-2">Address</h2>
            <p className="py-2 rounded-xl  bg-gray-100 text-gray-700">
              {adminProfile?.address}
            </p>
          </div>
        </div>

        <div className="mt-4 text-gray-500">
          Created User
          <p className="w-[48.5%] py-2 rounded-xl  bg-gray-100 text-gray-700">
            {adminProfile?.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
};
