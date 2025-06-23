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
      <thead className="text-gray-600 text-sm border-b bg-gray-100">
        <tr>
          <th className="p-2">ID</th>
          <th className="p-2">Image</th>
          <th className="p-2">Name</th>
          <th className="p-2">Description</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {category.length > 0 ? (
          category.map((product) => (
            <tr key={product._id} className="border-b hover:bg-gray-50">
              <td className="p-2 text-blue-400">{product?._id}</td>
              <td className="p-2">
                <img
                  src={`${backendUrl}/${product.imageUrl}`}
                  alt={product.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="p-2 font-medium">{product?.name}</td>
              <td className="p-2 text-blue-400">
                {product?.description ? product.description : "---"}
              </td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                  Edit Product
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-gray-500 p-4">
              No categories available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
