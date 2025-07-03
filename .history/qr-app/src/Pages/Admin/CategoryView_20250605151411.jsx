import React, { useEffect, useState } from "react";
import { CardDetails } from "../../components/CardDetails";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../../Redux/Cart/index.js";
import { ReverseButton } from "../../components/Client/ReverseButton.jsx";

export const CategoryView = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [itemArray, setItems] = useState([]);
  const categoryAdmin = location.pathname.replace(/^\/+/, "");
  const category = categoryAdmin.replace("admin/", "");

  useEffect(() => {
    const rawItems = location.state?.items;
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const categoryFromPathAdmin = location.pathname
      .replace(/^\/+/, "")
      .toLowerCase();
    const categoryFromPath = categoryFromPathAdmin.replace("admin/", "");

    const filteredItems = items.filter(
      (item) =>
        item?.categoryId?.name?.trim().toLowerCase() === categoryFromPath
    );

    setItems(filteredItems);
  }, [location]);

  function handleAddToCart(product) {
    dispatch(addToCartAction(product));
  }
  return (
    <div className="burger-container">
      <div className=" ">
        <ReverseButton route={"/admin"} routeName={category} />
      </div>
      <div className=" grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-4 mt-7">
        {itemArray.map((product) => (
          <CardDetails
            key={product._id}
            id={product._id}
            dishName={product.name}
            description={product.description}
            price={product.price}
            image={product.imageUrl}
            onAddToCart={() => handleAddToCart(product)}
            product={product}
            button={false}
          />
        ))}
      </div>
    </div>
  );
};
