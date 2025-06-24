import React from "react";
import image from "../../../../public/assets/image1.jpg";
export const ProfileAdmin = () => {
  return (
    <div className="p-4">
      <header>
        <div>
          <img src={image} alt="image" className="w-[50px] h-[50px]" />
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
