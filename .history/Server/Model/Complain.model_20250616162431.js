import mongoose, { Schema } from "mongoose";

const complainSchema = mongoose.Schema({
  userId: {
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
  createdAt: {
    type: new Date(),
    default: Date.now(),
  },
});

mongoose.
