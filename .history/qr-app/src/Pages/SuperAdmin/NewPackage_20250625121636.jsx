import React from "react";

export const NewPackage = () => {
  return (
    <div>
      <form className="w-full  bg-gray-200 flex flex-col justify-center items-center gap-10  sm:flex-row sm:w-[70%] sm:mx-auto">
        <div className="gap-6">
          <label htmlFor="title" className="text-l font-medium">
            Title
          </label>
          <input type="text" name="title" />
        </div>
      </form>
    </div>
  );
};
