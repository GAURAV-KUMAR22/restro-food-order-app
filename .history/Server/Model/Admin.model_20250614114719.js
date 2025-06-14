import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
    address: String,
    phone: Number,
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    isApproved: {
      type: Boolean,
      default: false, // SuperAdmin must approve
    },
    adminAccess: {
      type: String,
      enum: ["granted", "rejected"],
      default:
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { Timestamp: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
