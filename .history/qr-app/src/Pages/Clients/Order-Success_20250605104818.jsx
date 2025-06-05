import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { socket } from "../../Services/Socket";

import StarIcons from "react-rating-stars-component";
import { MdExpandCircleDown } from "react-icons/md";
import { TbInputSpark } from "react-icons/tb";
import ErrorBoundary from "../../Util/ErrorBoundry";

export const OrderSuccess = () => {
  const [orders, setOrder] = useState(null);
  const [user, setUser] = useState([]);
  const [feedBackForm, setFeedBackForm] = useState(false);
  const [feedBackInput, setFeedBackInput] = useState("");
  const [retingValue, setRetingValue] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [showOlderOrders, setShowOlderOrders] = useState(false); // state to control showing older orders

  async function fetched(userId) {
    try {
      const res = user && (await publicAxios(`/orders/${userId}`));
      if (res.status !== 200) {
        throw new Error("Response failed");
      }
      const orders = res.data.content;
      setOrder(orders);
    } catch (err) {
      throw new Error(err.messsage);
    }
  }

  useEffect(() => {
    setIsOpen(true);
    const storedUser = localStorage.getItem("user");
    const existingUser = storedUser ? JSON.parse(storedUser) : null;

    if (existingUser) {
      setUser(existingUser);
      fetched(existingUser._id); // Initial fetch
    }

    socket.emit("join-admin");

    const handleOrderUpdate = (data) => {
      if (existingUser) {
        fetched(existingUser._id); // Use stored user directly
      }
    };

    socket.on("order-updated-status", handleOrderUpdate);

    return () => {
      socket.off("order-updated-status", handleOrderUpdate); // ✅ Use named function for proper cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ratingChanged(newRating) {
    setRetingValue(newRating);
  }

  async function handleFeedBack(newRating) {
    const productIdsMap =
      incompleteOrders?.flatMap(
        (order) => order.items?.map((item) => item.productId._id) || []
      ) || [];

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) throw new Error("User not logged in");

      const response = await publicAxios.post("/products/rating", {
        productIds: productIdsMap,
        userId: user._id,
        rating: retingValue,
        feedback: feedBackInput,
      });

      setIsOpen(close);
    } catch (error) {
      console.error("Rating failed:", error);
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const allDelivered =
        orders && orders.every((order) => order.status === "delivered");

      if (allDelivered) {
        const delay = 10 * 60 * 1000;

        setTimeout(() => {
          localStorage.removeItem("user");
          setUser(null);
        }, delay);
      }
    }
  }, [orders]);

  // Filter orders based on status
  const incompleteOrders = orders
    ?.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    )
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

  const completedOrders = orders
    ?.filter((order) => order.status === "delivered")
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

  return (
    <div className="w-[98%] mx-auto flex flex-col items-center justify-center bg-green-50 p-4">
      <ErrorBoundary>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-50">
            <div className="w-[95%] max-w-md rounded-lg p-6 text-center bg-white shadow-xl relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>

              <div className="mb-4">
                <h1 className="text-2xl font-semibold text-green-600">
                  Please Review Us
                </h1>
                <p className="text-gray-600 mt-1">
                  Let us know how the food and service were.
                </p>
              </div>

              <div className="flex flex-col justify-center items-center mb-4">
                <p className="text-sm font-medium mb-2">
                  How much would you like to rate us?
                </p>
                <StarIcons
                  count={5}
                  onChange={ratingChanged}
                  size={50}
                  isHalf={true}
                  emptyIcon={<i className="far fa-star" />}
                  halfIcon={<i className="fa fa-star-half-alt" />}
                  fullIcon={<i className="fa fa-star" />}
                  activeColor="#ffd700"
                />
              </div>

              <div className="flex flex-col gap-3">
                <textarea
                  name="feedback"
                  rows="4"
                  placeholder="Write something..."
                  className="border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={(e) => setFeedBackInput(e.target.value)}
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
                  onClick={handleFeedBack}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </ErrorBoundary>

      {user && Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-4">
          {/* Display Incomplete Orders (Default) */}
          {incompleteOrders.length > 0 ? (
            <div className="text-center flex flex-col justify-center items-center">
              <CheckCircle className="text-green-500 w-15 h-15 mb-4" />
              <h1 className="text-xl font-bold text-green-700 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Thank you for your order. Here are your order details:
              </p>
            </div>
          ) : null}
          {incompleteOrders.length > 0 ? (
            incompleteOrders.map((order, index) => (
              <div key={index}>
                <details
                  key={order._id}
                  className={`border border-gray-300 rounded-xl p-4 gap-4 shadow-md bg-white transition-all`}
                >
                  <summary className="min-w-[280px] cursor-pointer font-semibold text-md text-blue-600 flex flex-col gap-4 justify-between items-center">
                    <span className="flex ">
                      {index + 1}-OrderId: {order._id.slice(-5)}
                      <span className="ml-5 mx-auto rounded-md ">
                        <MdExpandCircleDown size={25} />
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.placedAt).toLocaleString()}
                    </span>
                  </summary>

                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p>
                        <span className="font-medium capitalize">
                          Customer:
                        </span>{" "}
                        {order.userId?.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {order.userId?.phone}
                      </p>
                      <p>
                        <span className="font-medium capitalize">Status:</span>{" "}
                        {order.status}
                      </p>
                      <p>
                        <span className="font-medium">Payment:</span>{" "}
                        {order.paymentMethod}
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> ₹
                        {order.totalAmount}
                      </p>
                      <p>
                        <span className="font-medium">Tax:</span> ₹{order.tax}
                      </p>
                      <p>
                        <span className="font-medium">Delivery Charge:</span> ₹
                        {order.deliveryCharge}
                      </p>
                      <p>
                        <span className="font-medium">Table:</span>
                        {order.userId?.table}
                      </p>
                    </div>

                    <div className="mt-4 capitalize">
                      <p className="font-medium mb-2">Items:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.productId.name} — ₹{item.price} x{" "}
                            {item.quantity}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="ml-2 text-blue-500"
                        onClick={() => window.print()}
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            ))
          ) : (
            <div className="text-center flex flex-col justify-center items-center">
              <CheckCircle className="text-green-500 w-15 h-15 mb-4" />
              <h1 className="text-xl font-bold text-green-700 mb-2">
                Order completed
              </h1>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Thank you for your order.
              </p>
            </div>
          )}

          {/* Display Delivered Orders (When Clicked) */}
          {showOlderOrders && completedOrders.length > 0 && (
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-bold text-green-700 mb-4">
                Older Orders
              </h2>
              {completedOrders.map((order, index) => (
                <details
                  key={order._id}
                  className={`border border-gray-300 rounded-xl p-4 gap-4 shadow-md bg-white transition-all`}
                >
                  <summary className="min-w-[280px] cursor-pointer font-semibold text-md text-blue-600 flex flex-col gap-4 justify-between items-center">
                    <span className="flex ">
                      {index + 1}-OrderId: {order._id.slice(-5)}
                      <span className="ml-5 mx-auto rounded-md ">
                        <MdExpandCircleDown size={25} />
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.placedAt).toLocaleString()}
                    </span>
                  </summary>

                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p>
                        <span className="font-medium">Customer:</span>{" "}
                        {order.userId?.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {order.userId?.phone}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {order.status}
                      </p>
                      <p>
                        <span className="font-medium">Payment:</span>{" "}
                        {order.paymentMethod}
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> ₹
                        {order.totalAmount}
                      </p>
                      <p>
                        <span className="font-medium">Tax:</span> ₹{order.tax}
                      </p>
                      <p>
                        <span className="font-medium">Delivery Charge:</span> ₹
                        {order.deliveryCharge}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium mb-2">Items:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.productId.name} — ₹{item.price} x{" "}
                            {item.quantity}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="ml-2 text-blue-500"
                        onClick={() => window.print()}
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>No Orders Found</div>
      )}

      <div className="flex gap-5 text-center">
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-3 rounded-xl shadow-md transition"
        >
          Go to Home
        </Link>
        <button
          onClick={() => setShowOlderOrders(!showOlderOrders)} // Toggle showing older orders
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 mt-3 rounded-xl shadow-md transition"
        >
          {showOlderOrders ? "Hide Older Orders" : "Show Older Orders"}
        </button>
      </div>
    </div>
  );
};
