import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import publicAxios from "../Services/PublicAxios"; // your axios instance

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [orderData, setOrderData] = useState({
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrderStatus = async () => {
      try {
        const res = await publicAxios.get("/orders/orders", {
          signal: controller.signal,
        });

        if (res.status === 200 && Array.isArray(res.data.content)) {
          const allOrders = res.data.content;

          const statusCounts = allOrders.reduce(
            (acc, order) => {
              if (order.status === "pending") acc.pending += 1;
              else if (order.status === "delivered") acc.delivered += 1;
              else if (order.status === "cancelled") acc.cancelled += 1;
              return acc;
            },
            { pending: 0, delivered: 0, cancelled: 0 }
          );

          setOrderData(statusCounts);
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error("Failed to fetch order status:", error);
        }
      }
    };
    fetchOrderStatus();

    return () => {
      controller.abort();
    };
  }, []);

  const data = {
    labels: ["Pending Orders", "Delivered Orders", "Cancelled Orders"],
    datasets: [
      {
        label: "Order Status",
        data: [orderData.pending, orderData.delivered, orderData.cancelled],
        backgroundColor: [
          "rgba(255, 76, 48, 1)", // red
          "rgba(147, 250, 165)", // green
          "rgba(255, 206, 86, 0.6)", // yellow
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">
        Order Status Overview
      </h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
