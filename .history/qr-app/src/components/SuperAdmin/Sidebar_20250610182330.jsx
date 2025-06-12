import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = ({ item }) => {
  return (
    <div className="mt-3 px-3  rounded-lg p-3 flex justify-center items-start text-black">
      <Link>
        <h2 className="font-semibold">{item.name}</h2>
      </Link>
    </div>
  );
};
