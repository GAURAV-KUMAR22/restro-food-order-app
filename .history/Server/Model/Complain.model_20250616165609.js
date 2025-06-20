import mongoose, { Schema } from "mongoose";

const complainSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  subject: {
    type: String,
    required: true,
  },
  snapshot: {
    type: String,
    required: true,
  },
  complainDetail: {
    type: String,
  },
  resolve: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: new Date(),
    default: Date.now(),
  },
});

const Complain = mongoose.model("Complain", complainSchema);
export default Complain;
