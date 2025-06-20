import mongoose from "mongoose";

const visitorInfoSchema = mongoose.Schema({
  userAgent: String,
  language: String,
  platform: String,
  screen: Float32Array,
  timezone: TimeRanges,
  timestamp: Timestamp,
});
const VisitorInfo = mongoose.model("VisitorInfo", visitorInfoSchema);
export default VisitorInfo;
