import mongoose, { Schema } from "mongoose";

const subscriptionSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "failed", "pending"],
  },
});

const SubScription = mongoose.model("SubScription", subscriptionSchema);
export default SubScription;
