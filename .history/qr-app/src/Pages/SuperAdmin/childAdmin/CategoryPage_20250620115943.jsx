import React, { useEffect, useState } from "react";

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
    <div className="flex flex-col gap-2  py-2">
      {category.length > 0 &&
        products.map((product) => (
          <div
            key={product._id}
            className="flex justify-evenly items-center w-full gap-4 p-4 bg-gray-200 rounded shadow"
          >
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
    </div>
  );
};
