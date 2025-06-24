import React from "react";
import image from "../../../../public/assets/image1.jpg";
export const ProfileAdmin = () => {
  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <div>
          <img
            src={image}
            alt="image"
            className="w-[80px] h-[80px] rounded-full"
          />
          <div>
            <h1>Gaurav kumar</h1>
          </div>
        </div>
        <div>
          <button className="p-2 bg-blue-400">Edit</button>
        </div>
      </header>
    </div>
  );
};
