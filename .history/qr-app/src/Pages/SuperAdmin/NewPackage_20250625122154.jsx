import React from "react";

export const NewPackage = () => {
  return (
    <div>
      <form className="w-full  bg-gray-200 flex flex-col justify-center items-center gap-10  sm:flex-row sm:w-[40%] sm:mx-auto">
        <div className="w-full flex flex-col m-4">
          <label htmlFor="title" className="text-l font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border bg-gray-500 "
            placeholder="Enter Title"
          />
        </div>
      </form>
    </div>
  );
};
