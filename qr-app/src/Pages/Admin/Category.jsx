import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { ReverseButton } from "../../components/Client/ReverseButton";

export const Category = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetched() {
      const responce = await PrivateAxios.get("/products/category", {
        signal: controller.signal,
      });
      setCategory(responce.data.content);
    }
    fetched();
    return () => {
      controller.abort();
    };
  }, []);

  const BeackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  return (
    <div className="w-full">
      <div className="mb-5 ">
        <ReverseButton routeName={"Category"} route={"/admin"} />
      </div>

      <div className="flex flex-wrap mx-auto w-[98%] gap-4 ">
        {category?.map((item) => (
          <div key={item._id} className=" w-[100px] h-[100px] transform-3d ">
            <div className="bg-[#D9D9D9] flex justify-center items-center  w-[90%] h-[90%] rounded-full  ">
              <img
                src={`${BeackendUrl}/${item.imageUrl}`}
                alt=" chole"
                className="w-[70px] h-[70px] rounded-full -translate-z-6 items-center flex justify-center"
              />
            </div>
            <div className="text-[11px] flex text-center justify-center items-center mt-2  ">
              <p className="text-center">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/admin/newCategory"
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#F9D718] w-[98%] lg:w-[98%] h-[48px] rounded-md flex items-center justify-center text-center"
      >
        Add Category
      </Link>
    </div>
  );
};
