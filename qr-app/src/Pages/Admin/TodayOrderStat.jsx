import React from "react";
import { useLocation } from "react-router-dom";
import { ReverseButton } from "../../components/Client/ReverseButton";

export const TodayOrderStat = () => {
  const location = useLocation();
  const items = location.state.items;

  return (
    <div>
      <div className="mb-4">
        <ReverseButton route={"/admin"} routeName={"Admin"} />
      </div>
      <div className="w-[98%] flex flex-col mx-auto">
        <h1 className="text-2xl font-bold mb-6">Today's Orders</h1>

        {Object.entries(items).map(([status, orders]) => (
          <div key={status} className="mb-10">
            <h2
              className={`text-xl font-semibold ${
                status === "delivered" ? "bg-green-400" : "bg-red-400"
              } capitalize mb-4 text-white bg-blue-500 px-4 py-1 rounded-lg inline-block`}
            >
              {status} Orders ({orders.length})
            </h2>

            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="py-2 px-4 border-b">#</th>
                    <th className="py-2 px-4 border-b">Order ID</th>
                    <th className="py-2 px-4 border-b">Customer</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Payment</th>
                    <th className="py-2 px-4 border-b">Placed At</th>
                    <th className="py-2 px-4 border-b">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        ...{order._id.slice(-5)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.userId?.name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.userId?.phone}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-2 px-4 border-b capitalize">
                        {order.status}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.paymentMethod}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(order.placedAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <details>
                          <ul className="list-disc pl-4 text-sm text-gray-700">
                            {order.items?.map((item, idx) => (
                              <li key={idx}>
                                {item.productId.name} — ₹{item.price} ×{" "}
                                {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
