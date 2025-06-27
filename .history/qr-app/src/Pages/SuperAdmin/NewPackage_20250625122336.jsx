import React from "react";

export const NewPackage = () => {
  return (
    <div>
      <form className="w-full  bg-gray-200 flex flex-col justify-center items-center gap-10  sm:flex-row sm:w-[40%] sm:mx-auto">
        <div className="w-full flex flex-col m-4">
          <label htmlFor="title" className="text-xl font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2  bg-white "
            placeholder="Enter Title"
          />
          <label htmlFor="title" className="text-xl font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2  bg-white "
            placeholder="Enter Title"
          />
          <label htmlFor="title" className="text-xl font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2  bg-white mb-2 "
            placeholder="Enter Title"
          />
          <button className="w-full p-2 bg-blue-700">Submit</button>
        </div>
      </form>
    </div>
  );
};
