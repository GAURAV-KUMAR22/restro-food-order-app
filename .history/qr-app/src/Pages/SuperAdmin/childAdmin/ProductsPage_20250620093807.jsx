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

  return (
    <div className="flex items-center p-2">
      <div className="flex flex-row w-full px-4 p-2 gap-3.5 items-center bg-gray-500 text-white">
        <img
          src={crud}
          alt="loog"
          style={{ width: 40, height: 40 }}
          className="rounded-full"
        />
        <p>Apple</p>
        <p>Catgeory</p>
        <p>Price</p>
      </div>
    </div>
  );
};
