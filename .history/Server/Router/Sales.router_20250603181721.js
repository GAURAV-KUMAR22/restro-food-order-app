import express from "express";
import {
  getAllSales,
  getBestSellingItems,
  getTotelSale,
} from "../Controller/Sales.Controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { OptionalRoute } from "../Middleware/OptionalRoute.js";
const router = express.Router();

router.get("/", ProtectedRoute, getAllSales);
router.get("/totelSale", ProtectedRoute, getTotelSale);
router.get("/best-selling-item", getBestSellingItems);

export default router;
