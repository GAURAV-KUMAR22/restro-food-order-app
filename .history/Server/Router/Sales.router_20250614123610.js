import express from "express";
import {
  getAllAdminSales,
  getAllSales,
  getBestSellingItems,
  getTotelSale,
} from "../Controller/Sales.Controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { OptionalRoute } from "../Middleware/OptionalRoute.js";
import { EnsureIsApproved } from "../Middleware/EnsureIsApproved.js";
import { isSuperAdmin } from "../Services/IsSuperAdmin.js";
const router = express.Router();

router.get("/", ProtectedRoute, EnsureIsApproved, getAllSales);
router.get("/totelSale", ProtectedRoute, EnsureIsApproved, getTotelSale);
router.get("/getTotelSale", ProtectedRoute, isSuperAdmin, getAllAdminSales);
router.get(
  "/best-selling-item",
  OptionalRoute,

  getBestSellingItems
);

export default router;
