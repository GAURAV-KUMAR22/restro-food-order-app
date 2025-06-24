import React from "react";
import image from "../../../../public/assets/image1.jpg";
export const ProfileAdmin = () => {
  return (
    <div className="my-2">
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
          <button className="px-4 p-2 bg-blue-400 mr-[50%]">Edit</button>
        </div>
      </header>
    </div>
  );
};
