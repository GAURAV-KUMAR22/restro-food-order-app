// backend/routes/paymentRoutes.js
import express from "express";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import {
  getCheckoutSession,
  postCheckoutPayment,
  stripeWebhook,
} from "../Controller/Payment.Controller.js";

const router = express.Router();

// router.post('/create-order', createOrder);
// router.post('/verify', verifyPayment);

router.post("/create-checkout-session", postCheckoutPayment);
router.get("/verify-checkout-session", ProtectedRoute, getCheckoutSession);
router.get("/webhook", ProtectedRoute, stripeWebhook);

export default router;
