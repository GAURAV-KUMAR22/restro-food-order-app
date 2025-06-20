import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateAxios from "../../../Services/PrivateAxios";

export const CategoryPage = () => {
  const [category, setCategory] = useState([]);
  const shopId = useParams();
  console.log(shopId);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products/category", {
        params: {
          shopId: shopId.id,
        },
      });
      setCategory(response.data.content);
    };
    fetched();
  }, []);
  console.log(category);
  return (
    <div className="flex flex-col gap-2  py-2">
      {category.length > 0 &&
        category.map((product) => (
          <div
            key={product._id}
            className="flex justify-evenly items-center w-full gap-4 p-4 bg-gray-200 rounded shadow"
          >
            <img
              src={`${backendUrl}/${product.imageUrl}`}
              alt={product.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <p className="w-1/4 font-medium">{product?.name}</p>
            <button className="bg-white shadow-md p-2 rounded-md">
              Edit Products
            </button>
          </div>
        ))}
    </div>
  );
};
