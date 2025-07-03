import mongoose from "mongoose";

const clientPaymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paymentId: String,
    amount: Number,
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    date: {
      type: Date,
    },
  },
  { Timestamp: true }
);

const ClientPayment = mongoose.model("ClientPayment", clientPaymentSchema);
export default ClientPayment;
