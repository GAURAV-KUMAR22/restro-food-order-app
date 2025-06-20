import mongoose from "mongoose";
import Product from "../Model/Product.model.js";
import Sales from "../Model/Sales.model.js";

export const getAllSales = async (req, res) => {
  const { startDate, endDate, status, category, paymentMethod } = req.query;
  const shopId = req.user._id.toString();
  const matchStage = {
    shopId: new mongoose.Types.ObjectId(shopId),
  };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    matchStage.date = { $gte: start, $lte: end };
  }
  if (status) matchStage.status = status;
  if (paymentMethod) {
    const methods = paymentMethod.split(",").map((m) => m.trim());
    matchStage.paymentMethod =
      methods.length > 1 ? { $in: methods } : methods[0];
  }

  const pipeline = [
    { $match: matchStage },

    // Unwind bestSellingItems array
    { $unwind: "$bestSellingItems" },

    // Lookup product details
    {
      $lookup: {
        from: "products",
        localField: "bestSellingItems.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },

    // Lookup category of each product
    {
      $lookup: {
        from: "categories",
        localField: "productDetails.categoryId",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },

    // Filter by category name (case-insensitive, partial match)
    ...(category
      ? [
          {
            $match: {
              "categoryDetails.name": {
                $regex: category,
                $options: "i",
              },
            },
          },
        ]
      : []),

    // Group back to sales document with filtered items
    {
      $group: {
        _id: "$_id",
        date: { $first: "$date" },
        totelOrders: { $first: "$totelOrders" },
        totelRevenue: { $first: "$totelRevenue" },
        status: { $first: "$status" },
        paymentMethod: { $first: "$paymentMethod" },
        bestSellingItems: {
          $push: {
            productId: "$bestSellingItems.productId",
            quantity: "$bestSellingItems.quantity",
            totalAmount: "$bestSellingItems.totalAmount",
            productName: "$productDetails.name",
            category: "$categoryDetails.name",
          },
        },
      },
    },

    // Optional: Remove sales that have no bestSellingItems after filtering
    {
      $match: {
        bestSellingItems: { $ne: [] },
      },
    },
  ];

  try {
    const salesData = await Sales.aggregate(pipeline);

    if (!salesData.length) {
      return res.status(404).json({ message: "No sales records found" });
    }

    res.status(200).json({ content: salesData });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getBestSellingItems = async (req, res) => {
  const rowShopId = req.query?.shopId;
  const shopId = new mongoose.Types.ObjectId(rowShopId);

  if (!shopId) {
    return res.status(400).json({ message: "Shop ID is required" });
  }
  try {
    const salesData = await Sales.aggregate([
      { $unwind: "$bestSellingItems" },
      {
        $group: {
          _id: "$bestSellingItems.productId",
          name: { $first: "$bestSellingItems.name" },
          totalQuantitySold: { $sum: "$bestSellingItems.quantitySold" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]);

    const productIds = salesData.map((item) => item._id);

    const products = await Product.find({
      _id: { $in: productIds },
      shopId: shopId,
    }).populate("categoryId");

    return res.status(200).json({ content: products || [] });
  } catch (error) {
    console.error("Error fetching best-selling items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTotelSale = async (req, res) => {
  const shopId = req.user._id.toString();
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // 00:00:00.000

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // 23:59:59.999

    const todaySales = await Sales.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId), // Ensure correct ObjectId
          date: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totelRevenue" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({ content: todaySales });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllAdminSales = async (req, res) => {
  const totalSale = await Sales.aggregate([
    {
      $group: {
        _id: null, // Group all documents into one group
        totalRevenue: { $sum: "$totelRevenue" }, // Sum of revenue
        totalOrders: { $sum: 1 }, // Count of documents (orders)
      },
    },
  ]);

  if (!totalSale) {
    return res.status(200).json({ content: null });
  }
  res.status(200).json({ content: totalSale });
};
