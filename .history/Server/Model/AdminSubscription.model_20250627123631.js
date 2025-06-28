import mongoose, { Schema } from "mongoose";

const subscriptionSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  paymentStatus: { type: String, enum: ["paid", "unpaid"], required: true },
});

const SubScription = mongoose.model("SubScription", subscriptionSchema);
export default SubScription;
