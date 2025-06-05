import React from "react";

export const SearchInput = ({ setSearch }) => {
  return (
    <div className="search-container min-w-[90% ] items-start">
      <p className="flex justify-start mb-3 pl-1">
        Choose the best dish for you
      </p>
      <div className="flex flex-row items-center gap-2 flex-shrink-0 border border-gray-500 w-[100%] h-[40px] text-start rounded-xl pl-3 ">
        <img
          src="/assets/lenspng.svg"
          alt="lens"
          className="w-[16px] h-[16px]"
        />
        <input
          type="search"
          name="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          className="pr-2 border-none w-[100%] h-[40px] bg-transparent outline-none"
        ></input>
      </div>
    </div>
  );
};
