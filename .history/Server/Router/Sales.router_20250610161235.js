import express from "express";
import {
  getAllSales,
  getBestSellingItems,
  getTotelSale,
} from "../Controller/Sales.Controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { OptionalRoute } from "../Middleware/OptionalRoute.js";
import { EnsureIsApproved } from "../Middleware/EnsureIsApproved.js";
const router = express.Router();

router.get("/", ProtectedRoute, EnsureIsApproved, getAllSales);
router.get("/totelSale", ProtectedRoute, EnsureIsApproved, getTotelSale);
router.get(
  "/best-selling-item",
  OptionalRoute,
  EnsureIsApproved,
  getBestSellingItems
);

export default router;
