import Razorpay from "razorpay";
import Stripe from "stripe";
import dotenv from "dotenv";
import Admin from "../Model/Admin.model.js";
import SubScription from "../Model/AdminSubscription.model.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import crypto from "crypto";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// === Create Razorpay Order ===
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};

// === Verify Razorpay Signature ===

export const verifyPayment = async (req, res) => {
  const { _id } = req.user;
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageId,
      startDate,
      endDate,
    } = req.body;

    // Step 1: Verify Signature
    const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureData)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Step 2: Save subscription in DB
    const subscription = new SubScription({
      adminId: userId,
      packageId,
      startDate,
      endDate,
      paymentStatus: "paid",
    });

    await subscription.save();

    // Step 3: Update admin subscription
    await Admin.findByIdAndUpdate(userId, {
      subscription: {
        plan: packageId,
        subscribedAt: startDate,
        expiresAt: endDate,
      },
    });

    res.status(200).json({
      message: "Payment verified and plan updated",
      subscriptionId: subscription._id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal server error" });
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
