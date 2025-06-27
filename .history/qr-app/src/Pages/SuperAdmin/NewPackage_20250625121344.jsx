import React from "react";

export const NewPackage = () => {
  return (
    <div>
      <form className="w-full  bg-gray-200 flex flex-col justify-center items-center  sm:flex-row sm:w-[70%] sm:mx-auto">
        <div>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="w-full border bg-gray-400"
            />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>
        </div>

        <div>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>
        </div>
      </form>
    </div>
  );
};
