import React, { useCallback, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";

export const PackagesSuperAdmin = () => {
  const [packageItem, setpackageItems] = useState([]);
  const fetchpackageItem = useCallback(async () => {
    try {
      const response = await PrivateAxios.get("/subscription/package");
      if (response.status !== 200) {
        toast.error("response Failed");
        return;
      }
      setpackageItems(response.data.content);
    } catch (error) {
      toast.error("An error occurred while fetching packages");
    }
  }, []);

  useEffect(() => {
    fetchpackageItem();
  }, [fetchpackageItem]);
  return (
    <div className="px-2">
      <div>
        <header className="flex justify-end items-center p-2">
          <Link
            to={`${location.pathname}/new-package`}
            className="text-md rounded-sm font-semibold bg-blue-400 p-1 px-2"
          >
            Add package
          </Link>
        </header>
        <div className=" h-full mt-2 px-10">
          <h1 className="text-2xl font-bold text-center">Our Plans</h1>
          <p className="text-center text-sm">
            Take your desired planto get accesss to our content
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center overflow-x-scroll my-2 gap-12 scroll-smooth snap-center"
            style={{ scrollbarWidth: "none" }}
          >
            {packageItem &&
              packageItem.length > 0 &&
              packageItem.map((item, index) => (
               
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
