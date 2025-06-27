import React from "react";
import { Link } from "react-router-dom";

export const PackagesSuperAdmin = () => {
  return (
    <div className="px-2">
      <div>
        <header className="flex justify-between items-center bg-gray-300 p-2">
          <h1 className="text-xl font-semibold text-gray-400">Packages</h1>
          <Link className="text-xl font-semibold bg-blue-400">Add Package</Link>
        </header>
      </div>
    </div>
  );
};
