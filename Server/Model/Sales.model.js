import mongoose, { mongo } from "mongoose";

const salesSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totelOrders: Number,
  totelRevenue: Number,
  bestSellingItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      quantitySold: Number,
    },
  ],
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
