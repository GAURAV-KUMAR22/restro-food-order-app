import React, { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import QrCode from "react-qr-code";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./Services/ProtectedRoutes";
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

import toast, { Toaster } from "react-hot-toast";
import { ShopDetails } from "./Pages/ShopDetails";
import { SuperAdminSignup } from "./Pages/Auth/SuperAdminSignup";
import { SuperAdminLogin } from "./Pages/Auth/SuperAdminLogin";
import { AllAdmin } from "./Pages/SuperAdmin/AllAdmin";
import { PendingAdmins } from "./Pages/SuperAdmin/PendingAdmins";
import { useDispatch, useSelector } from "react-redux";
import { SuperAdminLayout } from "./Pages/SuperAdmin/Layout";
import { DashBoard } from "./Pages/SuperAdmin/DashBoard";
import { AdminDetails } from "./Pages/SuperAdmin/AdminDetails";
import { AdminDashboard } from "./Pages/SuperAdmin/childAdmin/AdminDashboard";
import { ProductsPage } from "./Pages/SuperAdmin/childAdmin/ProductsPage";
import { CategoryPage } from "./Pages/SuperAdmin/childAdmin/CategoryPage";
import { Settings } from "./Pages/Admin/Settings";
import { VisitorInfo } from "../utils/VisitorInfo";
import publicAxios from "./Services/PublicAxios";
import { logout } from "./Redux/Fetures/authSlice";
import { SuspendedAdmins } from "./Pages/SuperAdmin/SuspendedAdmins";
import { ProfileAdmin } from "./Pages/SuperAdmin/childAdmin/ProfileAdmin";
import { Package } from "./Pages/Admin/Package";
import { SettingSuperAdmin } from "./Pages/SuperAdmin/SettingSuperAdmin";

const backendUrl =
  import.meta.env.VITE_MODE === "Production"
    ? import.meta.env.VITE_BACKEND_PROD
    : import.meta.env.VITE_BACKEND_DEV;

const socket = io(backendUrl);
function App() {
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.auth);
  useEffect(() => {
    const handleConnect = () => {};

    const handleDisconnect = () => {};

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const getInfo = VisitorInfo();
    publicAxios.post("/auth/visitor-info", getInfo);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const MAX_AGE = 24 * 60 * 60 * 1000;
    if (userAuth.timestamp && Date.now() - userAuth.timestamp > MAX_AGE) {
      dispatch(logout()); // clears Redux state & optionally persist
      toast.success("session expired");
    }
  }, [userAuth.timestamp, dispatch]);

  const reduxState = useSelector((state) => state.auth);
  console.log(reduxState);
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
          {/* SuperAdmin */}

          {/* SuperAdmin Protected */}
          <Route path="/superadmin/signup" element={<SuperAdminSignup />} />
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route
            path="/superAdmin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashBoard />} />
            <Route path="superadmin-profile" element={<DashBoard />} />
            <Route path="admin-list" element={<AllAdmin />} />
            <Route path="admin-list/:id" element={<AdminDetails />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="category" element={<CategoryPage />} />
              <Route path="profile" element={<ProfileAdmin />} />
            </Route>
            <Route path="setting" element={<SettingSuperAdmin />} />
            <Route path="pending-admin" element={<PendingAdmins />} />
            <Route path="suspended-admin" element={<SuspendedAdmins />} />
          </Route>

          {/* Client */}
          <Route index element={<ShopDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/package" element={<Package />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop/:shopId">
            <Route index element={<Home />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="product/:id" element={<ProductsDetails />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="cart-bill" element={<PaymentsMethod />} />
            <Route path=":category" element={<FoodCategory />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>

          {/* Admin Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <DashBoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/createProduct"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Category"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newCategory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:category"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CategoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pending-orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <OrderUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/totelsale"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TotalSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-visualize"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GraphicalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/today-orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TodayOrderStat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Page */}
          <Route
            path="/unauthorized"
            element={
              <h1 className="text-center text-xl text-red-500 mt-10">
                Access Denied
              </h1>
            }
          />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
