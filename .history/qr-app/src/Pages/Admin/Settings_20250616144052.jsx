import { Settings2 } from "lucide-react";
import React from "react";

export const Settings = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl text-center my-5 font-semibold text-gray-500 ">
          Admin Settings
          <span>
            <Settings2 />
          </span>
        </h1>
        <div className="flex flex-row  items-center  mx-20  w-[90%] h-50">
          <div className="w-[170px] shadow-2xl bg-gray-200 px-2 py-2">
            <h1>Raise Complaints</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
