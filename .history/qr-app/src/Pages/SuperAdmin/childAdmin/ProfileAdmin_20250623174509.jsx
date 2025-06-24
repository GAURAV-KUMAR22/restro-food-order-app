import React from "react";
import image from "../../../../public/assets/image1.jpg";
export const ProfileAdmin = () => {
  return (
    <div className="my-2 mx-2 ">
      <header className="flex justify-between items-center">
        <div className="flex gap-6">
          <img
            src={image}
            alt="image"
            className="w-[80px] h-[80px] rounded-full"
          />
          <div className="flex flex-col justify-center text-gray-500">
            <h1>Gaurav kumar</h1>
            <p>gorav.panwar@ggmail.com</p>
          </div>
        </div>
        <div>
          <button className="px-4 p-2 bg-blue-400 mr-10">Edit</button>
        </div>
      </header>
      <div>
        <div className="flex my-2 w-full justify-between gap-10 ">
          <div className="flex flex-col w-full">
            <h2 className="flex pl-2 text-gray-500 mb-2">FullName</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              Gaurav kumar
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex  text-gray-500 mb-2">Email</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              Gaurav@test.com
            </p>
          </div>
        </div>
        <div className="flex my-2 w-full justify-between gap-10 ">
          <div className="flex flex-col w-full">
            <h2 className="flex pl-2 text-gray-500 mb-2">FullName</h2>
            <p className=" w-full py-2 rounded-xl pl-4  bg-gray-100 text-gray-700">
              Gaurav kumar
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="flex  text-gray-500 mb-2">Email</h2>
            <p className=" px-8 py-2 rounded-xl pl-4 bg-gray-100 text-gray-700">
              Gaurav@test.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
