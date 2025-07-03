// backend/routes/paymentRoutes.js
import express from "express";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import {
  createOrder,
  getCheckoutSession,
  paymentOrder,
  postCheckoutPayment,
  stripeWebhook,
  verifyPayment,
  verifyPayment_Order,
} from "../Controller/Payment.Controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/create-order-client", paymentOrder);
router.post("/verify-payment-client", verifyPayment_Order);

// router.post("/create-checkout-session", postCheckoutPayment);
// router.get("/verify-checkout-session", getCheckoutSession);
// // router.post("/webhook", ProtectedRoute, stripeWebhook);

export default router;
