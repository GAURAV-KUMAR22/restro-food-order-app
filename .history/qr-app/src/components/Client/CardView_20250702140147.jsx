import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");

  console.log(AdminMatch);
  return (
    <div className={`${css} capitalize mb-3`}>
      {Object.keys(products || {}).map((categoryName) => {
        const categoryProducts = products[categoryName] || [];
        const hasStock = categoryProducts.some(
          (product) => product.totelQuantity || product.quantity
        );

        return (
          <div key={categoryName}>
            <div className="flex justify-between px-4 py-2">
              <h2 className="text-sm font-semibold">{categoryName}</h2>
              <Link
                to={
                  isAdminRoute
                    ? `/admin/${categoryName}`
                    : `${location.pathname}/${categoryName}`
                }
                state={{ items: categoryProducts }}
                className="text-blue-500"
              >
                See More
              </Link>
            </div>

            <div
              className="flex overflow-x-auto space-x-4 px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categoryProducts.map((product) => (
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
        );
      })}
    </div>
  );
};
