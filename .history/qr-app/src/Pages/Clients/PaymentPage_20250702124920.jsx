import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, syncCartFromLocalStorage } from "../../Redux/Cart/index";
import { ReverseButton } from "../../components/Client/ReverseButton";
import { socket } from "../../Services/Socket";
import { ImSpinner9 } from "react-icons/im";
import toast from "react-hot-toast";
import axios from "axios";

export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const userId = searchParams.get("userId");
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const { shopId } = useParams();

  useEffect(() => {
    dispatch(syncCartFromLocalStorage());
  }, [dispatch]);

  const totalPrice = Array.isArray(cart)
    ? cart.reduce(
        (acc, item) =>
          acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
      )
    : 0;

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
    paymentMethod: paymentMethod,
    shopId: shopId,
  };

  const handleCashOrder = async () => {
    setLoading(true);

    try {
      const response = await publicAxios.post(
        "/orders/place-order",
        productData
      );

      if (response.status === 200 || response.status === 201) {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        socket.emit("join-admin");
        socket.emit("order-placed");
        navigate(`/shop/${shopId}/order-success`);
      } else {
        toast.error("Failed to place cash order");
      }
    } catch (err) {
      console.error("Cash order error:", err);
      toast.error("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  const handleUPIFlow = async () => {
    setLoading(true);
    try {
      // Step 1: Place the order in backend to get order._id
      const orderRes = await publicAxios.post("/orders/place-order", {
        userId,
        items: mappedItems,
        amount: totalPrice,
        shopId,
      });

      const order = orderRes.data.order;
      console.log("order response", order);
      // Step 2: Create Razorpay order with 100 paise (1 rupee)
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order-client",
        {
          userId: userId,
          amount: 100,
          shopId: shopId,
          orderId: order._id,
        }
      );

      // Step 3: Setup Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, // This should be 100 paise (1 rupee)
        currency: "Inr",
        name: "my shop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment-client",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                orderId: order._id,
                amount: totalPrice, // Keep track of the actual amount
              }
            );

            if (verifyRes.status === 200) {
              dispatch(clearCart());
              toast.success("Payment successful!");
              socket.emit("join-admin");
              socket.emit("order-placed");
              navigate(`/shop/${shopId}/order-success`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("UPI payment error:", err);
      toast.error("Error in UPI payment flow");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (paymentMethod === "Cash") {
      handleCashOrder();
    } else if (paymentMethod === "UPI") {
      handleUPIFlow();
    } else {
      toast.error("Please select a payment method");
    }
  };

  return (
    <div>
      <div className="my-2">
        <ReverseButton
          route={`/shop/${shopId}/user-info?userId=${userId}`}
          routeName={"Payment Method"}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <ImSpinner9 className="animate-spin" size={70} />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 mx-2 items-center">
            <h2 className="text-2xl text-center">Payment Methods</h2>

            <div
              className={`flex justify-center w-[90%] h-12 text-center items-center rounded ${
                paymentMethod === "Cash" ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <button
                onClick={() => setPaymentMethod("Cash")}
                className="w-full"
              >
                Cash
              </button>
            </div>

            <div
              className={`flex justify-center w-[90%] h-12 text-center items-center rounded ${
                paymentMethod === "UPI" ? "bg-green-600" : "bg-gray-200"
              }`}
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
              to={`/shop/${shopId}/user-info?userId=${userId}`}
              className="w-[50%] flex items-center justify-center bg-gray-200 rounded"
            >
              Discard
            </Link>

            {paymentMethod ? (
              <button
                className="w-[50%] flex items-center justify-center bg-amber-300 rounded"
                onClick={handleSave}
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
