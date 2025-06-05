import Cart from "../Model/Cart.model.js";
import Order from "../Model/Order.model.js";
import Product from "../Model/Product.model.js";
import Sales from "../Model/Sales.model.js";

export const getAllOrders = async (req, res) => {
  const id = req.params.id || req.user._id.toString();
  console.log("is", id);
  try {
    const orders = await Order.find({ shopId: id })
      .populate("userId")
      .populate("items.productId");
    if (!orders.length === 0) {
      return res.status(400).json({ data: null });
    }
    res.status(200).json({ content: orders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const activeOrders = async (req, res) => {
  const id = req.user._id.toString();
  console.log("active orders id ", id);
  try {
    const orders = await Order.find({
      status: { $in: ["pending", "processing"] },
      shopId: new mongoose.Types.ObjectId(id),
    })
      .populate("userId")
      .populate("items.productId");
    console.log("pendinds processs", orders);

    res.status(200).json({ content: orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
};

export const getTodayOrders = async (req, res) => {
  const shopId = req.user?._id.toString();
  console.log(shopId, "shijskjdnjdsnjds ");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to today's midnight (start of the day)

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const todayOrders = await Order.find({
      placedAt: {
        $gte: today,
        $lt: tomorrow,
      },
      shopId: shopId,
    })
      .populate("userId")
      .populate("items.productId");
    res.status(200).json({ content: todayOrders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const postOrder = async (req, res) => {
  const {
    items,
    totalAmount,
    tax,
    deliveryCharge,
    userId,
    paymentMethod,
    shopId,
  } = req.body;

  if (!items || !totalAmount) {
    return res.status(400).json({ message: "Items not found" });
  }

  try {
    const newOrder = new Order({
      userId: userId,
      items,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      shopId: shopId,
    });
    await newOrder.save();

    // Update the quantities of the products in the inventory
    try {
      if (items.length > 0) {
        // Use Promise.all to handle multiple async operations
        const updatePromises = items.map((item) => {
          return Product.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: -item.quantity } }, // Decrease quantity
            { new: true }
          );
        });

        // Wait for all product updates to complete
        await Promise.all(updatePromises);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating product quantities" });
    }

    // Remove items from the cart after successful order placement
    await Cart.deleteOne({ userId: userId });

    res
      .status(201)
      .json({ message: "Order successfully placed", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const shopId = req.user._id.toString();
  const { status, productIds, paymentMethod } = req.body;
  if (!id) {
    return res.status(400).json({ message: "OrderId is not found" });
  }

  try {
    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "delivered") {
      try {
        const quantityMap = new Map();

        for (const item of productIds) {
          const key = item.productId._id.toString();

          if (quantityMap.has(key)) {
            quantityMap.get(key).quantitySold += item.quantity;
          } else {
            quantityMap.set(key, {
              productId: item.productId._id,
              name: item.productId.name,
              quantitySold: item.quantity,
            });
          }
        }
        const bestSellingItems = Array.from(quantityMap.values());

        const productObjectIds = Array.from(
          new Set(productIds.map((item) => item.productId._id))
        );

        const newSale = await new Sales({
          totelOrders: 1,
          totelRevenue: order.totalAmount,
          products: productObjectIds,
          bestSellingItems: bestSellingItems, // now an array
          shopId: shopId,
          paymentMethod: paymentMethod,
        });
        console.log(newSale);
        await newSale.save();
      } catch (error) {
        console.error("Error saving sales:", error);
      }
    }

    if (status === "cancelled" && productIds && productIds.length > 0) {
      // Update product quantities for "cancelled" status
      try {
        await Promise.all(
          productIds.map(async (item) => {
            const prodId = item.productId._id;
            const orderedQty = item.quantity;

            if (prodId && typeof orderedQty === "number") {
              await Product.findByIdAndUpdate(
                prodId,
                { $inc: { quantity: orderedQty } }, // Increase quantity
                { new: true }
              );
            } else {
              console.warn("Invalid product or quantity:", item);
            }
          })
        );
      } catch (error) {
        return res.status(500).json({ message: "Error updating stock" });
      }
    }

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getOrder = async (req, res) => {
  const userId = req.params.id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const order = await Order.find({
      userId: userId,
      placedAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("userId")
      .populate("items.productId");

    if (!order) {
      return res.status(400).json(null);
    }
    res.status(200).json({ content: order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// export const postPaymentOrder = async (req, res) => {
//     const { amount, currency } = req.body;
//     const razorPay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET
//     });

//     const option = {
//         amount: amount,
//         currency: currency,
//         receipt: "recipt1",
//         payment_capture: 1
//     };

//     try {
//         const responce = await razorPay.orders.create(option);
//         if (!responce) {
//             res.status(400).json({ message: 'Something issue in payment' })
//         };
//         res.status(200).json({
//             order__id: responce._id,
//             currency: responce.currency,
//             amount: responce.amount,
//             status: responce.status
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error })
//     }
// };

// export const getRazorpayPayment = async (req, res) => {
//     const { paymentId } = req.params;
//     const razorPay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET
//     });
//     try {
//         const payment = await razorPay.payments.fetch(paymentId);
//         if (!payment) {
//             return res.status(400).json({ message: 'Payment does not fetch', error })
//         };

//         res.status(200).json({
//             status: payment.status,
//             method: payment.method,
//             amount: payment.amount,
//             currency: payment.currency,
//             // customerId: payment.customer_id
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error })
//     }
// }

// backend/controllers/paymentController.js
