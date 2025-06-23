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
    <div className="">
      <table className="w-full text-left border-collapse">
        <thead className="text-gray-600 text-sm border-b">
          <tr>
            <td>ProductImage</td>
            <td>ProductName</td>
            <td>ProductPrice</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 &&
            products.map((product) => (
              <div key={product._id} className="flex">
                <img
                  src={`${backendUrl}/${product.imageUrl}`}
                  alt={product.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="w-1/4 font-medium">{product?.categoryId?.name}</p>
                {/* <p className="w-1/4 text-gray-700">{product.category}</p> */}
                <p className="w-1/4 font-semibold">{product.price}</p>
                <button className="bg-white shadow-md p-2 rounded-md">
                  Edit Products
                </button>
              </div>
            ))}
        </tbody>
      </table>
    </div>
  );
};
