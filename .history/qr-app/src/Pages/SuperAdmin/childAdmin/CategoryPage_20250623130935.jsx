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
    <table className="w-full text-left border-collapse my-2">
      <thead className="text-gray-600 text-sm border-b bg-gray-100 mb-2">
        <tr className="p-2">
          <td p-1>Image</td>
          <td>Name</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {category.length > 0 &&
          category.map((product) => (
            <div key={product._id} className="flex">
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
      </tbody>
    </table>
  );
};
