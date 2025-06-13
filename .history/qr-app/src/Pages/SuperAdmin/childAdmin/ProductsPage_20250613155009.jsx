import React, { useEffect } from "react";
import PrivateAxios from "../../../Services/PrivateAxios";
import { useParams } from "react-router-dom";

export const ProductsPage = () => {
  const { id } = useParams();
  const adminId = id.replace(":", "");
  console.log(adminId);
  useEffect(() => {
    const fetched = async () => {
      const response = await PrivateAxios.get("/products", { params: adminId });
      console.log(response);
    };
    fetched();
  }, []);
  return <div>ProductsPage</div>;
};
