import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: Number,
    table: Number,
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { Timestamp: true }
);

const User = mongoose.model("User", userSchema);
export default User;
