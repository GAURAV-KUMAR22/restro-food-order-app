import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaGlobeAmericas } from "react-icons/fa";
import React, { useEffect } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import { useState } from "react";
import toast from "react-hot-toast";
import groupdata from "../../Util/getVisitorDeta";

const data = [
  { date: "Mar 27", visitors: 12, views: 20 },
  { date: "Apr 7", visitors: 18, views: 28 },
  { date: "Apr 19", visitors: 25, views: 35 },
  { date: "May 1", visitors: 20, views: 30 },
  { date: "May 19", visitors: 32, views: 50 },
  { date: "Jun 12", visitors: 28, views: 40 },
];

export const DashBoard = () => {
  const [salesData, setSalesData] = useState([]);
  const [data, setdata] = useState({});
  useEffect(() => {
    const fetched = async () => {
      const respponse = await PrivateAxios.get("/sales/getTotelSale");
      if (respponse.status === 200) {
        setSalesData(respponse.data.content);
      }
    };
    const fetchedVisitor = async () => {
      const response = await PrivateAxios.get("/auth/visitor-info");
      if (response.status !== 200) {
        null;
      }
      const grouped = groupdata(raw);
      setdata(grouped);
    };

    fetched();
    fetchedVisitor();
  }, []);
  console.log(data);
  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white min-h-screen">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-3xl font-bold">
            ₹{salesData[0]?.totalRevenue ? salesData[0].totalRevenue : 0}
          </p>
          {/* <p className="text-sm text-green-400">
            +33.21% compared to last week
          </p> */}
          <div className="mt-2 flex justify-between text-sm text-gray-400">
            <p>
              Total Orders:{" "}
              <span className="font-semibold text-white">
                {salesData[0]?.totalOrders ? salesData[0].totalOrders : 0}
              </span>
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Conversion Rate</h2>
          <p className="text-3xl font-bold">2.19%</p>
          <p className="text-sm text-red-400">-0.5% compared to last week</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-300">
            <li>🛒 Added to cart: 3.79%</li>
            <li>💳 Reached checkout: 3.88%</li>
            <li>✅ Sessions converted: 2.19%</li>
          </ul>
        </div>

        {/* Store Sessions */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Store Sessions</h2>
          <p className="text-3xl font-bold">{data.totalVisits}</p>
          <p className="text-sm font-bold">
            Unique session: {data.totalUniqueVisitors}
          </p>
          <p className="text-sm text-green-400">+9.5% compared to last week</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-300">
            <li>
              📱 Mobile: <span>{data?.devices?.mobile ?? 0}</span>
            </li>
            <li>
              💻 Desktop: <span>{data?.devices?.desktop ?? 0}</span>
            </li>
            <li>
              📟 Tablet: <span>{data?.devices?.tablet ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Visitors Analytics */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Visitors Analytics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#00d8ff"
              name="Unique Visitors"
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#ffc658"
              name="Page Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Session by Location (static example) */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaGlobeAmericas /> Session by Location
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-300">
          <li>🇺🇸 United States - 39.85%</li>
          <li>🇨🇳 China - 14.23%</li>
          <li>🇩🇪 Germany - 12.83%</li>
          <li>🇫🇷 France - 11.14%</li>
          <li>🇯🇵 Japan - 10.75%</li>
        </ul>
      </div>
    </div>
  );
};
