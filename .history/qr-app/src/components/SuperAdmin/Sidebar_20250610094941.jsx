import React from "react";

export const Sidebar = ({ item }) => {
  return (
    <div className="mt-3 px-3 border">
      <h2>{item.name}</h2>
    </div>
  );
};
