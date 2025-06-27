import Razorpay from "razorpay";
import Stripe from "stripe";
import dotenv from "dotenv";
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
  const { packageTitle, price, email, address } = req.body;

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
            unit_amount: price * 100, // in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-receipt-success",
      cancel_url: "http://localhost:5173/payment-receipt-failed",
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ["IN"], // Stripe requires this for Indian exports
      },
      customer_creation: "always",
      metadata: {
        customer_name: "gaurav",
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      message: "Stripe checkout session creation failed",
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

    res.status(200).json({
      session,
      customer,
    });
  } catch (error) {
    console.error("Stripe session fetch error:", error.message);
    res.status(500).json({
      message: "Unable to fetch Stripe session",
      error: error.message,
    });
  }
};
