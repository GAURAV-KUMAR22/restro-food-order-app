import mongoose from "mongoose";

const visitorInfoSchema = mongoose.Schema(
  {
    ip: { type: String }, // Visitor's IP address
    userAgent: { type: String }, // Full user agent string
    language: { type: String }, // e.g., "en-US"
    platform: { type: String }, // e.g., "Win32", "MacIntel"
    screen: {
      width: { type: Number },
      height: { type: Number },
    },
    timezone: { type: String }, // e.g., "Asia/Kolkata"
    referrer: { type: String }, // From document.referrer
    location: {
      country: { type: String },
      city: { type: String },
      region: { type: String },
    },
    visitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const VisitorInfo = mongoose.model("VisitorInfo", visitorInfoSchema);
export default VisitorInfo;
