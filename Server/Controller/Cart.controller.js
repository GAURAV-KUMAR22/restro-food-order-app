import mongoose from "mongoose";
import Cart from "../Model/Cart.model.js";
import Orders from "../Model/Order.model.js";
import Products from "../Model/Product.model.js";
import User from "../Model/Admin.model.js";
const objectId = new mongoose.Types.ObjectId();

export const getCartItems = async (req, res) => {
  // const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ userId: _id }).populate(
      "items.productId"
    );
    if (cart.length === 0) {
      return res.status(400).json({ data: null });
    }
    res.status(200).json({ data: cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const postAddTOCart = async (req, res) => {
  try {
    // ⬅️ user info should be attached from your auth middleware
    const { userId, items } = req.body;
    const newOrder = new Cart({
      userId: userId, // if you want to add userId also, add this in schema
      items,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ success: true, message: "Order placed!", content: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error while placing order" });
  }
};

export const patchIncrementCartQuantity = async (req, res) => {
  const { productId } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!productId) {
      return res.status(400).json({ message: "ProductId is not found" });
    }
    const item = await user.cart.findIndex(
      (product) => product.productId.toString === productId
    );
    if (item) {
      item.quantity += 1;
      await user.save();
    }
    res.status(400).json({ message: "Item not found in the cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const patchDecrementQuantity = async (req, res) => {
  const { productId } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!productId) {
      return res.status(400).json({ message: "ProductId is not found" });
    }

    const itemIndex = user.item(
      (product) => product.productId.toString() === productId
    );
    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      }
    } else {
      user.cart.splice(itemIndex, 1);
    }
    await user.save();
    res.status(201).json({ data: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getClearCart = async (req, res) => {};
