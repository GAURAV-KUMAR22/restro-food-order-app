import React, { useEffect } from "react";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

export const ProductsPage = () => {
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products", { params: id });
    };
    fetched();
  }, []);
  return <div>ProductsPage</div>;
};
