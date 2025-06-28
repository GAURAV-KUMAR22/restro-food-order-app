import Razorpay from "razorpay";
import Stripe from "stripe";
import dotenv from "dotenv";
import Admin from "../Model/Admin.model.js";
import SubScription from "../Model/AdminSubscription.model.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);
// import crypto from 'crypto';

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // Create Order
// export const createOrder = async (req, res) => {
//   const { amount } = req.body;

//   const options = {
//     amount: amount * 100, // Razorpay uses paise
//     currency: "INR",
//     receipt: `receipt_order_${Math.random() * 1000}`,
//   };

//   try {
//     const order = await razorpayInstance.orders.create(options);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Razorpay order failed", error: err });
//   }
// };

// // Verify Signature (after payment)
// export const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generatedSignature === razorpay_signature) {
//     res.status(200).json({ message: "Payment verified successfully" });
//   } else {
//     res.status(400).json({ message: "Invalid signature" });
//   }
// };

export const postCheckoutPayment = async (req, res) => {
  const {
    packageTitle,
    price,
    email,
    adminId,
    packageId,
    startDate,
    endDate,
    customerName,
  } = req.body;

  try {
    const amountInPaise = Math.round(Number(price) * 100);

    // Validate minimum charge for INR (₹0.50)
    if (amountInPaise < 50) {
      return res.status(400).json({ message: "Amount must be at least ₹0.50" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: packageTitle,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `http://localhost:5173/payment-receipt-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/payment-receipt-failed",

      customer_email: email,
      customer_creation: "always",

      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      billing_address_collection: "required",

      metadata: {
        customer_name: customerName || "N/A",
        adminId,
        packageId,
        startDate,
        endDate,
        packageTitle,
      },
    });

    console.log("✅ Created Stripe session:", session.id);

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    return res.status(500).json({
      message: "Failed to create Stripe Checkout session",
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
