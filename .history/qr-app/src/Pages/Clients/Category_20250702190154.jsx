import React, { useEffect, useState } from "react";
import { CardDetails } from "../../components/CardDetails";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../Context/AuthProvider";
import { addToCart } from "../../Redux/Cart/index.js";
import { ReverseButton } from "../../components/Client/ReverseButton.jsx";
import toast from "react-hot-toast";

export const Category = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [itemArray, setItems] = useState([]);

  // Extract category from pathname
  const categoryFromPath = decodeURIComponent(
    location.pathname.replace("/", "").toLowerCase()
  );

  useEffect(() => {
    const rawItems = location.state?.items;
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const filteredItems = items.filter(
      (item) =>
        item?.categoryId?.name?.trim().toLowerCase() === categoryFromPath
    );

    setItems(filteredItems);
  }, [location, categoryFromPath]);

  function handleAddToCart(product) {
    if (product.quantity > 0) {
      toast.success("Product added to cart successfully!");
      dispatch(addToCart(product));
    }
  }

  return (
    <div className="w-[98%] mx-auto">
      <div className="w-full h-[58px] flex items-center">
        <ReverseButton
          route={isAuthenticated ? "/admin" : "/"}
          routeName={categoryFromPath}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap">
        {itemArray.map((product) => (
          <CardDetails
            key={product._id}
            id={product._id}
            category={product.categoryId?.name}
            dishName={product.name}
            price={product.price}
            image={product.imageUrl}
            product={product}
            stock={product.quantity ?? 0}
            fixedStock={product.totelQuantity ?? 0}
            data={product}
            onAddToCart={() => handleAddToCart(product)}
            ratingValue={product.averageRating ?? 0}
          />
        ))}
      </div>
    </div>
  );
};
