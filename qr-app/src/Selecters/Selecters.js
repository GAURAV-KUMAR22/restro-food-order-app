import { createSelector } from "@reduxjs/toolkit";

export const selectGroupedProducts = createSelector(
  (state) => state.products.items,
  (products) => {
    return products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";

      if (!acc[category]) {
        acc[category] = {
          products: [],
          total: 0,
          categoryLabel: category,
        };
      }

      if (acc[category].products.length < 5) {
        acc[category].products.push(product);
      }

      acc[category].total += 1;

      return acc;
    }, {});
  }
);
