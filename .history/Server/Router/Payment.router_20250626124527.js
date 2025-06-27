// backend/routes/paymentRoutes.js
import express from "express";
import ProtectedRoute from "../Services/ProtectedRoute.js";

const router = express.Router();

// router.post('/create-order', createOrder);
// router.post('/verify', verifyPayment);

router.post("/create-checkout-session", ProtectedRoute, postCheckoutPayment);

export default router;
