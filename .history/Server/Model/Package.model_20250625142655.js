import mongoose from "mongoose";

const packageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Float32Array,
    required: true,
  },
  offerPrice: {
    type: Float32Array,
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
