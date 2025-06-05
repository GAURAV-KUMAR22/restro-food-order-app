import Category from "../Model/Category.model.js";
import Product from "../Model/Product.model.js";
import User from "../Model/Admin.model.js";
import Rating from "../Model/Ratings.model.js";

export const getAllProducts = async (req, res) => {
  let adminId = req.query?.shopId || req.user?._id.toString();
  console.log(adminId);
  try {
    const products = await Product.find({
      createdUser: `${adminId}`,
    }).populate("categoryId");
    if (!products) {
      return res.status(200).json(null);
    }
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error", error });
  }
};

export const postNewProduct = async (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  const { _id } = req.user;
  const imageUrl = req.file.filename;
  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: "Data is required" });
  }
  try {
    const newProduct = new Product({
      name: name.toLowerCase(),
      categoryId: category.toLowerCase(),
      price: price,
      quantity: quantity,
      totelQuantity: quantity,
      description: (description ? description : null).toLowerCase(),
      imageUrl: imageUrl,
      createdUser: _id,
    });

    await newProduct.save();

    await User.findByIdAndUpdate(
      _id,
      { $push: { allProducts: newProduct._id } },
      { new: true }
    );

    res.status(201).json({ message: "product added succussfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllCategory = async (req, res) => {
  const id = req.user._id.toString(); // or: String(req.user._id)

  try {
    const existedCategory = await Category.find({ createdUser: id });
    if (!existedCategory) {
      res.status(400).json({ message: "empty category", content: [] });
    }
    res.status(200).json({ content: existedCategory });
  } catch (error) {
    res.status(500).json({ massage: "Internal server error", error });
  }
};

export const getCategory = async (req, res) => {
  const { category } = req.params;
  try {
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const existingProducts = await Product.find({ createdAt: req.user });
    if (!existingProducts.length === 0) {
      return res.status(400).json({ message: "Products did not found" });
    }

    const Allcategory = [
      ...new Set(existingProducts.map((item) => item.category)),
    ];

    const SingleCategory = Allcategory.filter(
      (item) => item.category == category
    );
    res.status(200).json({ data: SingleCategory });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getProduct = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "ProductId is required" });
  }
  try {
    const product = await Product.findById({ _id: productId });
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const postCategory = async (req, res) => {
  const { name, description } = req.body;
  const imageUrl = req.file.filename;
  if (!name || !description) {
    return res.status(400).json({ message: "All fields Are required" });
  }
  try {
    const newCategoty = new Category({
      name: name.toLowerCase(),
      description: (description ? description : "").toLowerCase(),
      imageUrl,
      createdUser: req.user._id,
    });

    await newCategoty.save();
    res
      .status(201)
      .json({ message: "Category successfullt stired", content: newCategoty });
  } catch (error) {
    res.status(201).json({
      message: "Internal server error",
      error,
    });
  }
};

export const putProduct = async (req, res) => {
  const { name, description, price, category, quantity, image } = req.body;
  const { productId } = req.params;
  const imageUrl = req.file?.filename;

  try {
    const product = await Product.findById(productId);
    if (imageUrl) {
      product.imageUrl = imageUrl;
    }
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (category) {
      product.categoryId.name = category;
    }
    if (quantity) {
      product.quantity = quantity;
      product.totelQuantity = quantity;
    }

    await product.save();
    res.status(200).json({ content: product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "deleted succussfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error", error });
  }
};

export const postRating = async (req, res) => {
  const { rating, productIds, userId, feedback } = req.body;
  try {
    for (const productId of productIds) {
      const existingRating = await Rating.findOne({ userId, productId });

      if (existingRating) {
        existingRating.rating = rating;
        await existingRating.save();
      } else {
        const newRating = new Rating({ userId, productId, rating, feedback });
        await newRating.save();
      }

      // Recalculate average after each rating
      const allRatings = await Rating.find({ productId });
      const totalRatings = allRatings.length;
      const averageRating =
        allRatings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

      await Product.findByIdAndUpdate(productId, {
        averageRating: averageRating.toFixed(1),
        totalRatings,
      });
    }

    res.status(200).json({ message: "Ratings processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
