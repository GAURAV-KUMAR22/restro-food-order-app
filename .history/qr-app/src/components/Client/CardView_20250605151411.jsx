import React from "react";
import { Link } from "react-router-dom";
import { CardDetails } from "../CardDetails";

export const CardView = ({
  products,
  addToCarts,
  hideAddToCard,
  stock,
  fixedStock,
  cardCss,
  css,
}) => {
  return (
    <div className={`${css} capitalize mb-3`}>
      {Object.keys(products || {})?.map((categoryName) => (
        <div key={categoryName}>
          <div className="flex justify-between px-4 py-2">
            <h2 className="text-sm font-semibold">{categoryName}</h2>
            <Link
              to={`/${categoryName}`}
              state={{ items: products[categoryName] }}
              className="text-blue-500"
            >
              See More
            </Link>
          </div>

          <div
            className="flex overflow-x-auto space-x-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {(products[categoryName] || []).map((product) => (
              <div key={product._id} className="min-w-[150px] flex-shrink-0">
                <CardDetails
                  id={product._id}
                  category={product.categoryId?.name}
                  dishName={product.name}
                  price={product.price}
                  image={product.imageUrl}
                  product={product}
                  CardCss={cardCss}
                  stock={product.quantity ?? 0}
                  fixedStock={product.totelQuantity ?? 0}
                  data={product}
                  onAddToCart={addToCarts}
                  ratingValue={product.averageRating ?? 0}
                  button={hideAddToCard}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
