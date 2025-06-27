import React from "react";

export const NewPackage = () => {
  return (
    <div>
      <form className="w-full  bg-gray-200 flex flex-col justify-center items-center gap-10  sm:flex-row sm:w-full sm:mx-auto">
        <div className="w-[40%] flex flex-col">
          <label htmlFor="title" className="text-l font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border"
            placeholder="Enter Title"
          />
          <label htmlFor="title" className="text-l font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border"
            placeholder="Enter Title"
          />
          <label htmlFor="title" className="text-l font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border"
            placeholder="Enter Title"
          />
        </div>
      </form>
    </div>
  );
};
