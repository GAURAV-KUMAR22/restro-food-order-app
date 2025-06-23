import React, { useEffect, useState } from "react";
import crud from "../../../../public/assets/image1.jpg"; // Replace with your actual image path
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const shopId = useParams();
  console.log(shopId);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products", {
        params: {
          shopId: shopId.id,
        },
      });
      setProducts(response.data.data);
    };
    fetched();
  }, []);
  console.log(products);
  return (
    <table className="w-full text-left border-collapse my-2">
      <thead className="text-gray-600 text-sm border-b bg-gray-100">
        <tr>
          <th className="p-2">Product Image</th>
          <th className="p-2">Product Name</th>
          <th className="p-2">Product Price</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 &&
          products.map((product) => (
            <tr key={product._id} className="border-b hover:bg-gray-50 py-2">
              <td className="p-2">
                <img
                  src={`${backendUrl}/${product.imageUrl}`}
                  alt={product.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="p-2 font-medium">{product?.categoryId?.name}</td>
              <td className="p-2 font-semibold text-gray-700">
                {product.price}
              </td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                  Edit Product
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
