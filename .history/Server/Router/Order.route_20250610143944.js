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
import { EnsureIsApproved } from "../Middleware/EnsureIsApproved.js";

const route = express.Router();

route.get("/orders", ProtectedRoute, EnsureIsApproved, getAllOrders);
route.get("/active-orders", ProtectedRoute, EnsureIsApproved, activeOrders);
route.get("/today-orders", ProtectedRoute, EnsureIsApproved, getTodayOrders);
route.post("/place-order", postOrder);
route.patch("/:id", ProtectedRoute, EnsureIsApproved, updateOrder);
route.get("/:id", OptionalRoute, getOrder);

// payment Route

export default route;
