import React, { useEffect, useState } from "react";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

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
    <div>
      <div>
        {products.map((item, index) => {
          return (
            <div className="w-[240px] h-[170px] shadow-md border mt-4">
              <img
                src={`${backendUrl}/${item.imageUrl}`}
                alt="image"
                style={{ width: 100, height: 100 }}
              />
              <h2 className="capitalize text-xl text-black text-center">
                {item.name}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};
