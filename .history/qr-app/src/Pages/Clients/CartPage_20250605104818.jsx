import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  incrementCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../Redux/Cart";
import { ReverseButton } from "../../components/Client/ReverseButton";
import publicAxios from "../../Services/PublicAxios";
import { socket } from "../../Services/Socket";

export const CartPage = () => {
  const cartstate = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [fetchedProduct, setProducts] = useState([]);
  const navigate = useNavigate();

  const total = Array.isArray(cartstate)
    ? cartstate.reduce(
        (acc, item) =>
          acc +
          Number(item.price ? item.price : 0) *
            Number(item.quantity ? item.quantity : 0),
        0
      )
    : 0;

  // fetched prodcuts for stock quantity purpose
  useEffect(() => {
    socket.emit("join-admin");
    const fetchData = async () => {
      try {
        const responce = await publicAxios.get("/products");
        if (responce.status !== 200) {
          throw new Error({ message: "responce failed" });
        }
        setProducts(responce.data.data); // Set fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    cartstate.forEach((cartItem) => {
      const product = fetchedProduct.find((item) => item._id === cartItem._id);
      if (product) {
        if (cartItem.quantity > product.quantity) {
          localStorage.removeItem("cart");
          dispatch(
            updateQuantity({ id: cartItem._id, quantity: product.stock })
          );
        }
      }
    });
  }, [cartstate, fetchedProduct]);

  function handleMinusQuanity(id) {
    dispatch(removeFromCart(id));
  }

  useEffect(() => {
    if (cartstate.length === 0) {
      navigate("/");
    }
  }, [cartstate]);

  function handlePlusQuantity(id) {
    const cartProduct = cartstate.find((item) => item._id === id);
    const product = fetchedProduct.find((item) => item._id === cartProduct._id);
    if (cartProduct.quantity < product.quantity) {
      dispatch(incrementCart(id));
    }
  }

  return (
    <>
      {cartstate.length > 0 && (
        <div className="capitalize ">
          <div className=" flex justify-between ">
            <div className="w-[100%] h-[58px] items-center flex justify-between">
              <ReverseButton route={"/"} routeName={"Add to cart"} />
              <Link
                to={"/"}
                className="sticky right-6 top-4 flex flex-row items-center justify-end "
              >
                <img src="/assets/plus.png" alt="plus" width={25} height={10} />
                <p className="text-nowrap">Add Item</p>
              </Link>
            </div>
          </div>

          <div className=" mt-2 m-2 overflow-y-scroll relative">
            {Array.isArray(cartstate) &&
              cartstate.map(
                (item) =>
                  item.quantity && (
                    <div
                      key={item._id}
                      className="flex justify-between items-center rounded-xl shadow mb-4 p-1"
                    >
                      <div className="font-bold text-xl space-y-1">
                        <h4 className="inline text-base font-semibold capitalize">
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold text-gray-600 mb-4 capitalize">
                          {item.description}
                        </p>
                        <b className="text-black mt-[20px] font-bold">
                          Rs. {item.price}/-
                        </b>
                      </div>

                      <div className="right flex flex-col items-center gap-2">
                        <img
                          src="/assets/pizza.png"
                          alt="pizza"
                          className="w-[85px] h-[64px] object-cover rounded-md"
                        />

                        <div className="flex items-center justify-between w-[120px] h-[32px] rounded-md mt-6 bg-yellow-300 mr-2">
                          <button
                            onClick={() => handleMinusQuanity(item._id)}
                            className="p-1"
                          >
                            <img
                              src="/assets/minus.png"
                              alt="minus"
                              className="w-4 h-4 object-cover"
                            />
                          </button>

                          <span className="text-base font-semibold">
                            {item.quantity ? item.quantity : 0}
                          </span>

                          <button
                            onClick={() => handlePlusQuantity(item._id, item)}
                            className="p-1"
                          >
                            <img
                              src="/assets/plus.png"
                              alt="plus"
                              className="w-4 h-4 object-cover"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
          </div>

          <div className="relative bottom-0 left-0 right-0 mx-auto my-auto">
            <div className="order-calc">
              <div>
                <p>SubTotel</p>
                <b>{total}</b>
              </div>
              <div>
                <p>Discount</p>
                <b>0%</b>
              </div>
              <div>
                <p>Tex</p>
                <b>0%</b>
              </div>
              <div>
                <p>Totel</p>
                <b>Rs. {total}</b>
              </div>
            </div>
            <Link
              to={`/user-info`}
              className="bg-yellow-300 h-[40px] rounded-sm mx-auto my-0 w-[98%] items-center flex justify-center"
            >
              Place Order
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
