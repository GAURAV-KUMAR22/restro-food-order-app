import React, { useRef, useState } from "react";
import "../Pages/Clients/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import StarIcons from "react-rating-stars-component";
import publicAxios from "../Services/PublicAxios";

export const CardDetails = ({
  dishName,
  price,
  category,
  id,
  onAddToCart,
  image,
  product,
  CardCss,
  button,
  stock,
  fixedStock,
  data,
  ratingValue,
}) => {
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const [selected, setSelected] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const totalStock = fixedStock || 0;
  const availableStock = stock ?? 0;

  let stockTag;
  if (availableStock === 0) {
    stockTag = "OutOfStock";
  } else if (availableStock <= (totalStock / 100) * 10) {
    stockTag = "lowStock";
  } else {
    stockTag = "InStock";
  }

  // async function ratingChanged(newRating) {
  //   try {
  //     const userId = JSON.parse(localStorage.getItem("user"));
  //     const response = await publicAxios.post("/products/rating", {
  //       productId: id,
  //       userId: userId._id,
  //       rating: newRating,
  //     });
  //   } catch (error) {
  //     console.error("Rating failed:", error);
  //   }
  // }

  return (
    <div
      className={`flex flex-col justify-end shadow-md hover:scale-101 ${CardCss} my-0 sm:w-[190px] overflow-hidden hover:overflow-y-hidden`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Stock badge */}
      {isAuthenticated && (
        <div className="flex justify-end w-full px-1 mt-0.5 pt-2">
          <div
            className={`px-2 py-1.5 text-xs font-medium rounded-xl text-white ${
              stockTag === "OutOfStock"
                ? "bg-[#DC3545]"
                : stockTag === "lowStock"
                ? "bg-[#FFA500]"
                : "bg-[#1DB954]"
            }`}
          >
            {stockTag} <span className="font-medium">({availableStock})</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-col items-center justify-center pt-2 px-2 pb-1">
        <img
          src={`${backendUrl}/${image}`}
          alt={dishName}
          className="w-[60px] h-[60px] object-cover rounded-full"
        />
        <Link to={`/product/${id}`} state={{ product }}>
          <h3 className="text-sm font-medium tracking-tighter mt-2 text-center capitalize">
            {dishName}
          </h3>
          <p className="font-bold text-xs mt-1 text-center capitalize">
            Rs. {price}/-
          </p>
        </Link>
        <div className="hover:not-autofill:">
          <StarIcons
            count={5}
            size={20}
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt hover:disabled:"></i>}
            fullIcon={<i className="fa fa-star star-icon hover:disabled:"></i>}
            value={ratingValue}
          />
        </div>
      </div>

      {/* Button section */}
      {!button && (
        <button
          className={`${
            availableStock === 0 ? "pointer-events-none opacity-50" : ""
          } w-[85%] font-semibold bg-yellow-300 mb-2 rounded-sm h-[35px] mx-auto mt-1`}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
      )}
      {button && (
        <Link
          className="border w-[85%] mb-2 flex font-semibold rounded-sm h-[35px] justify-center items-center mx-auto mt-1"
          to={"/admin/createProduct"}
          state={{ product: data }}
        >
          Edit
        </Link>
      )}
    </div>
  );
};
