import mongoose, { Schema } from "mongoose";

const sunscriptionSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  package,
});
