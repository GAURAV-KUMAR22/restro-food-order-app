import React, { useEffect, useState } from "react";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";
import crud from "../../../../public/assets/image1.jpg";
export const ProductsPage = () => {
  const { id } = useParams();
  const adminId = id.replace(":", "");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products", {
        params: { shopId: adminId },
      });
      if (response.status === 200) {
        setProducts(response.data.data);
      }
    };
    fetched();
  }, []);

  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const products = [
    {
      id: 1,
      name: "Apple",
      category: "Fruit",
      price: "₹100",
      image: crud, // Or actual image URL
    },
    {
      id: 2,
      name: "Laptop",
      category: "Electronics",
      price: "₹45,000",
      image: crud,
    },
    {
      id: 3,
      name: "Shampoo",
      category: "Cosmetics",
      price: "₹150",
      image: crud,
    },
  ];

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
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
