import React, { useEffect, useState } from "react";
import { CardDetails } from "../../components/CardDetails";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../../Redux/Cart/index.js";
import { ReverseButton } from "../../components/Client/ReverseButton.jsx";

export const CategoryItems = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [itemArray, setItems] = useState([]);

  // Extract category from path (e.g., "admin/pizza" -> "pizza")
  const categoryAdmin = location.pathname.replace(/^\/+/, "");
  console.log(categoryAdmin);
  const category = categoryAdmin.replace("admin/", "").toLowerCase();
  const refineCategory = category.replace(/shop\/[^/]+\//, "");
  const isAdminRoute = location.pathname.includes("admin");
  useEffect(() => {
    const rawItems = location.state?.items;
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    console.log(items);
    const filteredItems = items.filter(
      (item) => item?.categoryId?.name?.trim().toLowerCase() === refineCategory
    );
    console.log(filteredItems);

    setItems(filteredItems);
  }, [location, category]);

  const handleAddToCart = (product) => {
    dispatch(addToCartAction(product));
  };
  console.log(location.pathname.replace(category));
  console.log(categoryAdmin);
  return (
    <div className="burger-container">
      <div>
        {isAdminRoute ? (
          <ReverseButton route={"/admin"} routeName={refineCategory} />
        ) : (
          <ReverseButton route={""} routeName={refineCategory} />
        )}
      </div>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-4 mt-7">
        {itemArray?.map((product) => (
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
            stock={product.quantity ?? 0}
            fixedStock={product.totelQuantity ?? 0}
          />
        ))}
      </div>
    </div>
  );
};
