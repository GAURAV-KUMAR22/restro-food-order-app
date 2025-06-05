import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { data, Link } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import PrivateAxios from "../../Services/PrivateAxios";
import { SalesFilter } from "../../components/Admin/SalesFilter";
import { FcEmptyFilter } from "react-icons/fc";
import { ReverseButton } from "../../components/Client/ReverseButton";

export const TotalSale = () => {
  const [salesData, setSaledData] = useState([]);
  const [todaySaleItem, setSaleToday] = useState([]);
  const [todayTotelRevenue, setTodayTotelRevenue] = useState(0);
  const [ShowFilter, setShowFilter] = useState(false);
  const [todaySaleAmount, SetTodaySale] = useState();

  async function onFilter(query) {
    try {
      const res = await PrivateAxios.get(`/sales`, {
        params: {
          startDate: query.startDate,
          endDate: query.endDate,
          status: query.status,
          category: query.category,
          paymentMethod: query.paymentMethod,
        },
      });
      if (res.status === 200) {
        setSaledData(res.data.content);
      }
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        console.error("Error fetching sales data:", error);
      }
    }
  }

  useEffect(() => {
    async function fetched() {
      const res = await PrivateAxios.get("/sales/totelSale");
      if (res.status === 200) {
        SetTodaySale(res.data.content[0].totalRevenue);
      }
    }
    fetched();
  }, []);

  // Calculate total sale
  const totalSale = salesData.reduce(
    (acc, item) => acc + (item.totelRevenue || 0),
    0
  );

  // Filter today's sales
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaySales = salesData.filter((item) => {
      const orderDate = new Date(item.date).toISOString().split("T")[0];
      return orderDate === today;
    });
    setSaleToday(todaySales);
  }, [salesData]);
  // Calculate today's total revenue
  useEffect(() => {
    const todayRevenue = todaySaleItem.reduce(
      (acc, item) => acc + (item.totelRevenue || 0),
      0
    );
    setTodayTotelRevenue(todayRevenue);
  }, [todaySaleItem]);

  return (
    <div className="relative">
      <div className="flex m-1 text-m mb-4 ">
        <ReverseButton route={"/admin"} routeName={"Sale"} />
      </div>

      <div className="absolute right-3 top-2.5 w-[80px] h-[30px] text-center items-center justify-center border rounded-md">
        <button
          className="flex font-semibold text-xl"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filter
          <span>
            <FcEmptyFilter size={25} />
          </span>
        </button>
      </div>

      <div className="min-w-[345px] h-[400px] mx-3 overflow-hidden ">
        {ShowFilter && (
          <div className="p-4 bg-gray-100 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Sales Filter</h2>
            <SalesFilter onFilter={onFilter} />
          </div>
        )}

        {totalSale ? (
          <div className="w-full bg-green-200 h-[50%] mb-2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center">Total Sale</h2>
            <h2 className="text-xl font-bold text-center mt-2">
              ₹ {totalSale || 0}
            </h2>
          </div>
        ) : (
          todaySaleAmount && (
            <div className="w-full bg-green-200 h-[50%] mb-2 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold text-center">Today Sale</h2>
              <h2 className="text-xl font-bold text-center mt-2">
                ₹ {todaySaleAmount || 0}
              </h2>
            </div>
          )
        )}
      </div>
    </div>
  );
};
