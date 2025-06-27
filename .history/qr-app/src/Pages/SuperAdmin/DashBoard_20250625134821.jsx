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
import { groupVisitorData } from "../../Util/getVisitorDeta";

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
  const [data, setdata] = useState();
  const [visitorInfo, setVisitorInfo] = useState({});
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
      setVisitorInfo(response.data.content);
      const grouped = groupVisitorData(response.data.content);

      setdata(grouped);
    };
    console.log(data);
    fetched();
    fetchedVisitor();
  }, []);
  return (
   
  );
};
