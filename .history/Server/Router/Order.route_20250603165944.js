import express from "express";
import {
  activeOrders,
  getAllOrders,
  getOrder,
  getTodayOrders,
  postOrder,
  updateOrder,
} from "../Controller/Orders.controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { OptionalRoute } from "../Middleware/OptionalRoute.js";

const route = express.Router();

route.get("/orders", ProtectedRoute, getAllOrders);
route.get("/active-orders", ProtectedRoute, activeOrders);
route.get("/today-orders", ProtectedRoute, getTodayOrders);
route.post("/place-order", postOrder);
route.patch("/:id", ProtectedRoute, updateOrder);
route.get("/:id", OptionalRoute, getOrder);

// payment Route

export default route;
