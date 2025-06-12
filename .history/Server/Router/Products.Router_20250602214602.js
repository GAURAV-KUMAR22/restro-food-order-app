import express from "express";
import upload from "../Services/Multer.js";
import {
  deleteProduct,
  getAllCategory,
  getAllProducts,
  getCategory,
  getProduct,
  postCategory,
  postNewProduct,
  postRating,
  putProduct,
} from "../Controller/Products.controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { OptionalRoute } from "../Middleware/OptionalRoute.js";
const route = express.Router();

route.get("/", OptionalRoute, getAllProducts);

route.post(
  "/new-product",
  ProtectedRoute,
  upload.single("picture"),
  postNewProduct
);

route.post(
  "/new-category",
  ProtectedRoute,
  upload.single("picture"),
  postCategory
);

route.get("/category", ProtectedRoute, getAllCategory);
route.get("/:category", getCategory);

route.post("/rating", postRating);

route.get("/:productId", getProduct);
route.delete("/:productId", deleteProduct);
route.put("/:productId", ProtectedRoute, upload.single("picture"), putProduct);

export default route;
