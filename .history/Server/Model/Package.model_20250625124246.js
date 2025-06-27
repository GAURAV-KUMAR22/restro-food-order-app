import mongoose from "mongoose";

const packageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prices: {
    type: Float32Array,
    required: true,
  },
  offeredPrices: {
    type: Float32Array,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
  features: [{ type: Object, required: true }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
