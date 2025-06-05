import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, syncCartFromLocalStorage } from "../../Redux/Cart/index";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { socket } from "../../Services/Socket";
import { ImSpinner9 } from "react-icons/im";
import toast from "react-hot-toast";

export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const userId = searchParams.get("userId");
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  // Sync localStorage when the component loads
  useEffect(() => {
    dispatch(syncCartFromLocalStorage());
  }, [dispatch]);

  const totalPrice = Array.isArray(cart)
    ? cart.reduce(
        (acc, item) =>
          acc +
          Number(item.price ? item.price : 0) *
            Number(item.quantity ? item.quantity : 0),
        0
      )
    : 0;

  const HandleplaceOrder = async () => {
    setLoading(true);
    try {
      const mappedItems = cart.reduce((acc, item) => {
        if (item.quantity) {
          acc.push({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
          });
        }
        return acc;
      }, []);

      const productData = {
        userId,
        items: mappedItems,
        totalAmount: totalPrice,
        paymentMethod: PaymentMethod,
      };

      const response = order
        ? null
        : await publicAxios.post("/orders/place-order", productData);

      if (response.status === 200 || response.status === 201) {
        setOrder(response.data.order);
        dispatch(clearCart()); // Clear Redux and localStorage
        toast.success("Your order was placed successfully!");
        socket.emit("join-admin");
        navigate("/order-success");
        const orderId = response.data.order._id;
        socket.emit("order-placed");
        setLoading(false);
      } else {
        console.error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // useEffect(() => {
  //   if (loading === "true") {
  //     setTimeout(() => {
  //       <p>failed order</p>;
  //     }, 2000);
  //   }
  // }, []);

  return (
    <div className="">
      {/* Back to user details link */}
      <div className="my-2">
        <ReverseButton
          route={`/user-info?userId=${userId}`}
          routeName={"Payment Method"}
        />
      </div>

      {/* Payment methods */}
      {loading ? (
        <div className="flex justify-center items-center">
          <ImSpinner9 className="animate-spin" size={70} />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 mx-2 items-center">
            <h2 className="text-2xl text-center">Payment Methods</h2>

            <div
              className={`flex justify-center w-[90%] h-12 text-center items-center rounded
  ${PaymentMethod === "Cash" ? "bg-green-600" : "bg-gray-200"}`}
            >
              <button
                onClick={() => setPaymentMethod("Cash")}
                className="w-full"
              >
                Cash
              </button>
            </div>

            <div
              className={`flex justify-center w-[90%] h-12 text-center items-center rounded
  ${PaymentMethod === "UPI" ? "bg-green-600" : "bg-gray-200"}`}
            >
              <button
                onClick={() => setPaymentMethod("UPI")}
                className="w-full"
              >
                UPI
              </button>
            </div>
          </div>

          <div className="flex fixed bottom-1 left-0 right-0 w-[98%] mx-auto gap-1 h-12">
            <Link
              to={`/user-info?userId=${userId}`}
              className="w-[50%] flex items-center justify-center bg-gray-200 rounded"
            >
              Discard
            </Link>

            {PaymentMethod ? (
              <button
                className="w-[50%] flex items-center justify-center bg-amber-300 rounded"
                onClick={HandleplaceOrder}
              >
                Save
              </button>
            ) : (
              <div className="w-[50%] flex items-center justify-center bg-red-200 text-sm text-gray-700 rounded">
                Select Payment Method
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
