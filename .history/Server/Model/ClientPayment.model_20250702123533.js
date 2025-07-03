import mongoose from "mongoose";

const clientPaymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  paymentId: String,
  amount: Number,
  status: {
    enum: ["success", "pending", "failed"],
    default: "pending",
  },
});

const ClientPayment = mongoose.model("ClientPayment", clientPaymentSchema);
export default ClientPayment;
