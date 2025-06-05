import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addToCart } from "../../Redux/Cart";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { useAuth } from "../../../Context/AuthProvider";

export const ProductsDetails = () => {
  const location = useLocation();
  const product = location.state?.product;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated } = useAuth();

  const BeackendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;

  const handleAddtoCart = () => {
    const alreadyInCart = cart.find((item) => item._id === product._id);
    if (alreadyInCart) {
      alert("Product Already Added");
      return;
    }
    dispatch(addToCart(product));
  };

  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <>
      <div className="w-[98%] h-[58px] flex items-center">
        {isAuthenticated ? (
          <ReverseButton route="/admin" routeName="Home" css="ml-2" />
        ) : (
          <ReverseButton route="/" routeName="Home" css="ml-2" />
        )}
      </div>

      <div className="flex flex-col mx-auto w-[98%] sm:w-[50%] h-auto sm:mx-auto">
        <div className="rounded-2xl mt-6 mx-auto shadow-lg bg-white p-4 w-[365px]">
          {/* Image Section */}
          <div className="flex justify-center items-center">
            <img
              src={`${BeackendUrl}/${product.imageUrl}`}
              alt="product"
              className="w-[100px] h-[100px] object-cover my-3 rounded-full shadow-md"
            />
          </div>

          {/* Product Details */}
          <div className="mt-6 w-[98%] capitalize">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="font-light text-gray-500 mr-2">Name:</span>
              {product.name}
            </h1>
            <p className="text-xl text-gray-700 flex justify-center">
              <span className="font-light text-gray-500 mr-2">
                Description:
              </span>
              {product.description}
            </p>
            <p className="text-xl text-gray-700">
              <span className="font-light text-gray-500 mr-2">
                Price: <b>Rs</b>
              </span>
              {product.price}
              <b>/-</b>
            </p>
          </div>

          {/* Add to Cart Button */}
          {!isAuthenticated && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAddtoCart}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all duration-200"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
