import React, { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import QrCode from "react-qr-code";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoutes } from "./Services/ProtectedRoutes";
import { Home } from "./Pages/Clients/Home";
import { CartPage } from "./Pages/Clients/CartPage";
import { Category as FoodCategory } from "./Pages/Clients/Category";
import { PaymentsMethod } from "./Pages/Clients/PaymentsMethod";
import { DashBoardPage } from "./Pages/Admin/DashBoardPage";
import { NewProduct } from "./Pages/Admin/NewProduct";
import { NewCategory } from "./Pages/Admin/NewCategory";
import { Category } from "./Pages/Admin/Category";
import { OrderSuccess } from "./Pages/Clients/Order-Success";
import { Signup } from "./Pages/Auth/Signup";
import { Login } from "./Pages/Auth/Login";
import { UserInfo } from "./Pages/Clients/UserInfo";
import { PaymentPage } from "./Pages/Clients/PaymentPage";
import { OrderUpdate } from "./Pages/Admin/OrderUpdate";
import { TotalSale } from "./Pages/Admin/TotalSale";
import { GraphicalPage } from "./Pages/Admin/GraphicalPage";
import { ProductsDetails } from "./Pages/Clients/ProductsDetails";
import { CategoryView } from "./Pages/Admin/CategoryView";
import { TodayOrderStat } from "./Pages/Admin/TodayOrderStat";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthProvider";

import { Toaster } from "react-hot-toast";

const backendUrl =
  import.meta.env.VITE_MODE === "Production"
    ? import.meta.env.VITE_BACKEND_PROD
    : import.meta.env.VITE_BACKEND_DEV;

const socket = io(backendUrl);
function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleConnect = () => {};

    const handleDisconnect = () => {};

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div className="box-border">
      <QrCode
        value="https://food-order-app-1-jddi.onrender.com/"
        className="hidden"
      />
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="m duration-400 x-auto my-auto w-[98%] animate-pulse">
            <div>
              <div className="mb-4 h-[250px] rounded-lg bg-gray-400"></div>
            </div>
            <div className="mb-4 h-[30px] w-full rounded bg-gray-400"></div>
            <div className="mb-8 flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] w-[170px] rounded-2xl bg-gray-400"
                ></div>
              ))}
            </div>
            <div className="mb-4 flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] w-[170px] rounded-2xl bg-gray-400"
                ></div>
              ))}
            </div>
            <div className="mb-4 h-[35px] w-full rounded bg-gray-400"></div>
            <div className="mb-4 h-[35px] w-full rounded bg-gray-400"></div>
          </div>
        }
      >
        <Routes className="min-w-[375px] h-auto">
          <Route index path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route index path="/user-info" element={<UserInfo />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductsDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart-bill" element={<PaymentsMethod />} />
          <Route path="/:category" element={<FoodCategory />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Admin Protected Routes */}
          <Route path="/" element={<ProtectedRoutes />} className="box-border">
            <Route index path="/admin" element={<DashBoardPage />} />
            <Route path="/admin/createProduct" element={<NewProduct />} />
            <Route path="/admin/Category" element={<Category />} />
            <Route path="/admin/newCategory" element={<NewCategory />} />
            <Route path="/admin/:category" element={<CategoryView />} />
            <Route path="/admin/pending-orders" element={<OrderUpdate />} />
            <Route path="/admin/totelsale" element={<TotalSale />} />
            <Route path="/admin/data-visualize" element={<GraphicalPage />} />
            <Route path="/admin/today-orders" element={<TodayOrderStat />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
