import React from "react";
import image from "../../../../public/assets/image1.jpg";
export const ProfileAdmin = () => {
  return (
    <div className="my-2 mx-2 border bg-gray-100">
      <header className="flex justify-between items-center">
        <div className="flex gap-6">
          <img
            src={image}
            alt="image"
            className="w-[80px] h-[80px] rounded-full"
          />
          <div className="flex flex-col justify-center">
            <h1>Gaurav kumar</h1>
            <p>gorav.panwar@ggmail.com</p>
          </div>
        </div>
        <div>
          <button className="px-4 p-2 bg-blue-400 mr-10">Edit</button>
        </div>
      </header>
      <div className="flex my-2 w-full justify-between">
        <div className="flex flex-col w-full">
          <h2 className="flex text-xl text-gray-500">FullName</h2>
          <p className="border w-full py-2">Gaurav kumar</p>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="flex text-xl text-gray-500">FullName</h2>
          <p className="border px-8">Gaurav kumar</p>
        </div>
      </div>
    </div>
  );
};
