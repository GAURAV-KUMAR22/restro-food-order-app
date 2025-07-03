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
});

const ClientPayment = mongoose.model("ClientPayment", clientPaymentSchema);
export default ClientPayment;
