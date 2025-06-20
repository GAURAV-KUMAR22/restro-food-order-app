import { SettingsIcon } from "lucide-react";
import React from "react";

export const Settings = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl text-center my-5 font-semibold text-gray-500 flex justify-center items-center gap-3.5 ">
          Admin Settings
          <span>
            <SettingsIcon size={30} />
          </span>
        </h1>
        <div className="flex flex-wrap gap-5  items-center  mx-20  w-[90%] h-50 my-10">
          <div className="w-[170px] shadow-2xl bg-gray-200 px-2 py-2 hover:bg-amber-300">
            <button>
              <h1>Raise Complaints</h1>
            </button>
          </div>
        </div>
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          <div className="absolute w-[600px] h-[500px] bg-white px-4">
            <form>
              <h1 className="text-2xl text-center my-4 font-semibold text-gray-600">
                Complaint Form
              </h1>
            </form>
            <div className="flex space-x-6 w-[100%] ">
              <div className="flex flex-col w-1/2 mb-2">
                <label htmlFor="date" className="mb-2">
                  Complaint Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
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
                  className="border p-2 border-gray-600 text-gray-600 "
                />
              </div>
            </div>
            <div>
              <label htmlFor="snapshot">snapshot</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
