
import Razorpay from 'razorpay';
// import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        receipt: `receipt_order_${Math.random() * 1000}`,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Razorpay order failed", error: err });
    }
};

// Verify Signature (after payment)
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (generatedSignature === razorpay_signature) {
        res.status(200).json({ message: "Payment verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid signature" });
    }
};
