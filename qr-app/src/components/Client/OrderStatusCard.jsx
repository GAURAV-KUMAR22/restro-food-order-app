import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaBicycle,
  FaWalking,
  FaShoppingBag,
  FaComments,
} from "react-icons/fa";
import { socket } from "../../Services/Socket";
import { ImCross } from "react-icons/im";
import { AnimatePresence, motion } from "framer-motion";

export default function OrderStatusCard({ orderStatus, onClose }) {
  const [orderStatusNow, setOrderStatus] = useState(orderStatus.status); // initialize with current status

  useEffect(() => {
    function setStatus() {
      setOrderStatus(orderStatus.status);
    }

    setStatus();
    socket.emit("join-admin");

    const handleOrderUpdate = (data) => {
      setStatus();
    };

    socket.on("order-updated-status", handleOrderUpdate);

    return () => {
      socket.off("order-updated-status", handleOrderUpdate); // Cleanup listener
    };
  }, [orderStatus.status]);

  const steps = [
    {
      label: "Pending",
      value: "pending",
      icon: <FaShoppingCart className="text-xl" />,
    },
    {
      label: "Processing",
      value: "processing",
      icon: <FaBicycle className="text-xl" />,
    },
    {
      label: "Nearby",
      value: "nearby",
      icon: <FaWalking className="text-xl" />,
    },
    {
      label: "Delivered",
      value: "delivered",
      icon: <FaShoppingBag className="text-xl" />,
    },
  ];

  // Find current step index
  const currentStepIndex = steps.findIndex(
    (step) => step.value === orderStatusNow
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-white  rounded-2xl p-6 w-[280px] shadow-lg flex flex-col gap-4 fixed right-4 top-4 transition ease-in bg-opacity-50 "
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: "spring", duration: 0, damping: 30, stiffness: 60 }}
        onClick={(e) => e.stopPropagatio}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <FaWalking className="text-green-500" />
            <span className="text-gray-700 text-sm font-semibold">
              Food is {orderStatusNow}
            </span>
          </div>
          <div className="text-blue-900 font-bold text-xl">~8 min</div>
        </div>

        {/* Status Progress */}
        <div className="flex items-center justify-between mt-4 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative w-20"
            >
              <div className="relative">
                <div
                  className={`${
                    index <= currentStepIndex
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                {index <= currentStepIndex && (
                  <span className="absolute -top-2 -right-2 bg-green-400 rounded-full w-4 h-4 flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.173 12.927a.5.5 0 0 1-.708-.707L10.793 7.5 5.465 2.172a.5.5 0 1 1 .707-.707l6 6a.5.5 0 0 1 0 .707l-6 6z" />
                    </svg>
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 mt-1">{step.label}</span>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-full h-1 w-[60px] ${
                    index < currentStepIndex ? "bg-green-400" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <Link
          to={"/order-success"}
          className="flex items-center gap-2 bg-blue-100 text-blue-900 rounded-xl py-2 justify-center hover:bg-blue-200 transition mt-3"
        >
          <FaComments className="text-xl" />
          <span className="font-semibold">Order Details</span>
        </Link>

        <button
          onClick={onClose}
          className="absolute top-0 right-3 bg-transparent w-7 mb-1 mt-1  text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
        >
          <ImCross className="text-black" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
