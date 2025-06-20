import React from "react";
import crud from "../../../../public/assets/image1.jpg"; // Replace with your actual image path

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

export const ProductsPage = () => {
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
