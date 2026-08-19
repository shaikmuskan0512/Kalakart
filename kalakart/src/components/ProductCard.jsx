import { useApp } from "../store";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    wishlist,
  } = useApp();

  // MongoDB products use _id
  const productId = product.id || product._id;

  const isWishlisted = wishlist.includes(productId);

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          100 -
            (product.price / product.originalPrice) * 100
        )
      : 0;

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className="product-card__image-wrap">
        {discount > 0 && (
          <span className="product-card__discount">
            {discount}% off
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        {/* WISHLIST */}
        <button
          type="button"
          className={`product-card__wishlist ${
            isWishlisted ? "is-active" : ""
          }`}
          onClick={() => toggleWishlist(product)}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
          >
            <path
              d="M20.8 8.6c0 5.5-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.6C3.2 5.5 5.4 3 8.3 3c1.7 0 3.2.8 4.2 2.1C13.5 3.8 15 3 16.7 3c2.9 0 4.1 2.5 4.1 5.6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* BODY */}
      <div className="product-card__body">
        <h3 className="product-card__name">
          {product.name}
        </h3>

        <p className="product-card__desc">
          {product.description}
        </p>

        <p className="product-card__location">
          {product.state}
        </p>

        {/* RATING */}
        <div className="product-card__rating">
          <span className="product-card__stars">
            {"★".repeat(
              Math.round(product.rating || 0)
            )}
            {"☆".repeat(
              5 - Math.round(product.rating || 0)
            )}
          </span>

          <span className="product-card__rating-num">
            {product.rating}
          </span>
        </div>

        {/* PRICE */}
        <div className="product-card__price-row">
          <div className="product-card__price">
            <span className="product-card__price-current">
              ₹
              {Number(
                product.price || 0
              ).toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <span className="product-card__price-original">
                ₹
                {Number(
                  product.originalPrice
                ).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* CART */}
          <button
            type="button"
            className="product-card__add"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}