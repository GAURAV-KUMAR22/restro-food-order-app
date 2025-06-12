import React from "react";

export const Sidebar = ({ item }) => {
  return (
    <div className="mt-3 px-3 border p-3 text-center text-white">
      <h2 className="font-semibold">{item.name}</h2>
    </div>
  );
};
