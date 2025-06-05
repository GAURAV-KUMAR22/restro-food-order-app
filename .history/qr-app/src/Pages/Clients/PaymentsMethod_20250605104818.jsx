import React from "react";
import "./Home.css";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css";
import PrivateAxios from "../../Services/PrivateAxios";
import { useSelector } from "react-redux";
import { ReverseButton } from "../../components/Client/ReverseButton";
export const PaymentsMethod = () => {
  const cart = useSelector((state) => state.cart.cartItems);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  // totel Price
  const totalPrice =
    cart?.reduce(
      (acc, item) =>
        acc +
        (item.price ? item.price : 0) * (item.quantity ? item.quantity : 0),
      0
    ) || 0;

  return (
    <div className="payment-method">
      <div className="">
        <ReverseButton
          route={`/user-info?userId=${userId}`}
          routeName={"Order Details"}
        />
      </div>
      <div className="amount">
        <p>Totel Amount</p>
        <b>Rs.{totalPrice}</b>/<p>Hundred Rupees</p>
      </div>
      <div className="order-details  mx-auto">
        <table className="styled-table">
          <thead>
            <tr>
              <td>Order-item</td>
              <td>QTY</td>
              <td>Price</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            {cart?.map(
              (item) =>
                item.quantity && (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs.{item.price}</td>
                    <td>{item.price * item.quantity}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <div className="payment-details mt-3">
        <div className="order-calc">
          <div>
            <p>SubTotel</p>
            <b>{totalPrice}</b>
          </div>
          <div>
            <p>Discount</p>
            <b>0%</b>
          </div>
          <div>
            <p>Texex</p>
            <b>0%</b>
          </div>
          <div>
            <p>Totel</p>
            <b>Rs. {totalPrice}</b>
          </div>
        </div>
      </div>
      <Link
        to={`/payment?userId=${userId}`}
        className="flex items-center justify-center bg-yellow-300 my-0 mx-auto  h-[40px] w-[98%]"
      >
        Pay
      </Link>
    </div>
  );
};
