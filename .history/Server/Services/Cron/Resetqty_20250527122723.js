import cron from "node-cron";
import Product from "../../Model/Product.model.js";

// Reset every day at 12:18 PM (or adjust time)
cron.schedule("0 0 * * *", async () => {
  try {
    const products = await Product.find();
    for (const product of products) {
      console.log(product);
      if (typeof product.totelQuantity === "number") {
        console.log(
          `Resetting product ${product._id}: ${product.quantity} → ${product.totalQuantity}`
        );
        product.quantity = product.totelQuantity;
        await product.save();
      }
    }

    console.log("✅ Product quantities reset successfully.");
  } catch (err) {
    console.error("❌ Error while resetting product quantities:", err.message);
  }
});
