import mongoose from "mongoose";

const packageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
  features: [{ type: String, required: true }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
