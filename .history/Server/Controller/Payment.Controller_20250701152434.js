import Razorpay from "razorpay";
import Stripe from "stripe";
import dotenv from "dotenv";
import Admin from "../Model/Admin.model.js";
import SubScription from "../Model/AdminSubscription.model.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import crypto from "crypto";
import { ClientEncryption } from "mongodb";
import ClientPayment from "../Model/ClientPayment.model.js";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const backendUrl = process.env.FRONTEND_DEV;

// === Create Razorpay Order ===
export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt,
      userId,
      packageId,
      startDate,
      endDate,
    } = req.body;

    if (!amount || !userId || !packageId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const options = {
      amount: amount * 100, // amount in paisa
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        userId,
        packageId,
      },
      handler: function (response) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + pkg.durationInDays);

        // ✅ Add required query params to redirect
        const redirectUrl =
          `${window.location.origin}/payment-success` +
          `?payment_id=${response.razorpay_payment_id}` +
          `&order_id=${response.razorpay_order_id}` +
          `&signature=${response.razorpay_signature}` +
          `&packageId=${pkg._id}` +
          `&userId=${userId}` +
          `&startDate=${startDate.toISOString()}` +
          `&endDate=${endDate.toISOString()}`;
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};

// === Verify Razorpay Signature ===
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      packageId,
      startDate,
      endDate,
    } = req.body;

    // Step 1: Check for missing fields
    const missingFields = [];
    if (!razorpay_order_id) missingFields.push("razorpay_order_id");
    if (!razorpay_payment_id) missingFields.push("razorpay_payment_id");
    // if (!razorpay_signature) missingFields.push("razorpay_signature");
    if (!userId) missingFields.push("userId");
    if (!packageId) missingFields.push("packageId");
    if (!startDate) missingFields.push("startDate");
    if (!endDate) missingFields.push("endDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    // Step 2: Verify Razorpay Signature
    const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureData)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Step 3: Save subscription
    const newSubscription = new SubScription({
      adminId: userId,
      packageId,
      startDate,
      endDate,
      paymentStatus: "paid",
    });

    await newSubscription.save();

    // Step 4: Update admin
    const subscription = await Admin.findByIdAndUpdate(
      userId,
      {
        subscription: {
          plan: packageId,
          subscribedAt: startDate,
          expiresAt: endDate,
        },
      },
      { new: true }
    );

    // ✅ Step 5: Redirect user to frontend payment-success page
    const redirectUrl =
      `http://localhost:5173/payment-success` +
      `?payment_id=${razorpay_payment_id}` +
      `&order_id=${razorpay_order_id}` +
      `&signature=${razorpay_signature}` +
      `&packageId=${packageId}` +
      `&userId=${userId}` +
      `&startDate=${startDate}` +
      `&endDate=${endDate}`;

    return res.status(200).json({
      subscription: newSubscription,
      isSubscribe: new Date(newSubscription.endDate) > new Date(),
      message: "Payment verified and plan updated",
      redirectUrl,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const paymentOrder = async (req, res) => {
  const { amount, orderId, userId, shopId, paymentMethod } = req.body;

  const missingFields = {};
  if (!amount) missingFields.amount = "amount field missing";
  if (!orderId) missingFields.orderId = "orderId field missing";
  if (!userId) missingFields.userId = "userId field missing";
  if (!shopId) missingFields.shopId = "shopId field missing";
  if (!paymentMethod)
    missingFields.paymentMethod = "paymentMethod field missing";

  if (Object.keys(missingFields).length > 0) {
    return res
      .status(400)
      .json({ message: "Missing required fields", errors: missingFields });
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        orderId,
        shopId,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      userId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ message: "Failed to create payment order" });
  }
};

export const verifyPayment_Order = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      orderId,
      paymentMethod,
      amount,
    } = req.body;

    // Collect missing fields
    const missingFields = {};
    if (!razorpay_order_id)
      missingFields.razorpay_order_id = "razorpay_order_id is undefined";
    if (!razorpay_payment_id)
      missingFields.razorpay_payment_id = "razorpay_payment_id is undefined";
    if (!razorpay_signature)
      missingFields.razorpay_signature = "razorpay_signature is undefined";
    if (!userId) missingFields.userId = "userId is undefined";
    if (!orderId) missingFields.orderId = "orderId is undefined";
    if (!paymentMethod)
      missingFields.paymentMethod = "paymentMethod is undefined";
    if (!amount) missingFields.amount = "amount is undefined";

    // If any field is missing, return an error
    if (Object.keys(missingFields).length > 0) {
      return res
        .status(400)
        .json({ message: "Missing fields", errors: missingFields });
    }

    // Generate expected signature
    const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureData)
      .digest("hex");

    // Validate the signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Save payment to DB
    const clientPayment = new ClientPayment({
      userId,
      orderId,
      paymentId: razorpay_payment_id,
      paymentMethod,
      amount,
      startDate,
      endDate,
      status: "success",
    });

    await clientPayment.save();

    return res.status(200).json({
      message: "Payment verified and saved successfully",
      payment: clientPayment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const postCheckoutPayment = async (req, res) => {
  const {
    packageTitle,
    price,
    email,
    adminId,
    packageId,
    startDate,
    endDate,
    customerName, // optionally send customerName from frontend
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: packageTitle,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment-receipt-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: "http://localhost:5173/payment-receipt-failed",

      customer_email: email,
      customer_creation: "always", // ensures customer is created

      shipping_address_collection: {
        allowed_countries: ["IN"], // required by Stripe for exports
      },
      billing_address_collection: "required", // ✅ also required by Stripe

      metadata: {
        customer_name: customerName || "N/A", // fallback if not passed
        adminId,
        packageId,
        startDate,
        endDate,
        packageTitle,
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({
      message: "Failed to create Stripe Checkout session",
      error: error.message,
    });
  }
};

export const getCheckoutSession = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customer = await stripe.customers.retrieve(session.customer);

    return res.status(200).json({
      session,
      customer,
    });
  } catch (error) {
    console.error("❌ Stripe session fetch error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch Stripe session",
      error: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;

    try {
      const newSubscription = new SubScription({
        adminId: metadata.adminId,
        packageId: metadata.packageId,
        startDate: new Date(metadata.startDate),
        endDate: new Date(metadata.endDate),
        isActive: session.payment_status === "paid",
        paymentStatus: session.payment_status === "paid" ? "paid" : "unpaid",
      });

      await newSubscription.save();

      await Admin.findByIdAndUpdate(metadata.adminId, {
        status: "subscribed",
        subscription: {
          plan: metadata.packageTitle,
          subscribedAt: new Date(metadata.startDate),
          expiresAt: new Date(metadata.endDate),
        },
      });

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error saving subscription:", error);
      return res.status(500).json({ error: "Failed to process subscription" });
    }
  }

  res.status(200).json({ received: true });
};
