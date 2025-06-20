import React, { useEffect, useState } from "react";
import crud from "../../../../public/assets/image1.jpg"; // Replace with your actual image path
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const shopId = useParams();
  console.log(shopId);
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products", {
        params: {
          shopId: shopId.id,
        },
      });
      setProducts(response.data.content);
    };
    fetched();
  }, []);
  return (
    <div className="flex flex-col gap-2  py-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center w-full gap-4 p-4 bg-gray-200 rounded shadow"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="w-1/4 font-medium">{product.name}</p>
          <p className="w-1/4 text-gray-700">{product.category}</p>
          <p className="w-1/4 font-semibold">{product.price}</p>
        </div>
      ))}
    </div>
  );
};
