// backend/routes/paymentRoutes.js
import express from "express";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import {
  createOrder,
  getCheckoutSession,
  postCheckoutPayment,
  stripeWebhook,
  verifyPayment,
} from "../Controller/Payment.Controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", ProtectedRoute, verifyPayment);

// router.post("/create-checkout-session", postCheckoutPayment);
// router.get("/verify-checkout-session", getCheckoutSession);
// // router.post("/webhook", ProtectedRoute, stripeWebhook);

export default router;
