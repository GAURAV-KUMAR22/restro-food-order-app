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
  durationInDays: {
    type: Number,
    required: true,
  },
  features
});
