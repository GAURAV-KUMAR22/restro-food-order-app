import mongoose, { Schema } from "mongoose";

const sunscriptionSchema = mongoose.Schema({
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
    default: "unpaid",
  },
});
