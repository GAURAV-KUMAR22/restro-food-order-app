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

  const backendUrl = import.meta.env.Vite_
  return (
    <div>
      <div>
        {products.map((item, index) => {
          return (
            <div>
              <img src={} alt="" />
              <h2>{item.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};
