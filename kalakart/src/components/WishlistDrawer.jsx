import { useApp } from "../store";
import "./Drawer.css";
import "./WishlistDrawer.css";

export default function WishlistDrawer() {
  const {
    wishlistOpen,
    setWishlistOpen,
    wishlistItems,
    removeFromWishlist,
    addToCart,
  } = useApp();

  // =========================================
  // ADD TO CART + REMOVE FROM WISHLIST
  // =========================================

  const handleAddToCart = async (item) => {
    try {
      // Add product to cart
      await addToCart(item);

      // Remove product from wishlist
      await removeFromWishlist(item.id);
    } catch (error) {
      console.error(
        "Unable to move item to cart:",
        error
      );
    }
  };

  return (
    <>
      {/* =========================================
          BACKDROP
      ========================================= */}

      <div
        className={`drawer-backdrop ${
          wishlistOpen ? "is-open" : ""
        }`}
        onClick={() => setWishlistOpen(false)}
      />


      {/* =========================================
          WISHLIST DRAWER
      ========================================= */}

      <aside
        className={`side-drawer ${
          wishlistOpen ? "is-open" : ""
        }`}
        aria-hidden={!wishlistOpen}
      >

        {/* =======================================
            HEADER
        ======================================= */}

        <div className="side-drawer__header">

          <div className="side-drawer__title">

            <span className="side-drawer__eyebrow">
              KALAKART
            </span>

            <h2>
              Wishlist
            </h2>

            <span className="side-drawer__count">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "item"
                : "items"}
            </span>

          </div>


          <button
            type="button"
            className="side-drawer__close"
            onClick={() =>
              setWishlistOpen(false)
            }
            aria-label="Close wishlist"
          >
            ✕
          </button>

        </div>


        {/* =======================================
            CONTENT
        ======================================= */}

        {wishlistItems.length === 0 ? (

          <div className="side-drawer__empty">

            <div className="side-drawer__empty-icon">

              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 20.5s-7.6-4.6-10-9.3C.4 7.7 2 4 5.8 4c2.2 0 3.7 1.2 4.6 2.6C11.3 5.2 12.8 4 15 4c3.8 0 5.4 3.7 3.8 7.2-2.4 4.7-10 9.3-10 9.3Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>

            </div>

            <h3>
              Your wishlist is empty
            </h3>

            <p>
              Your wishlist is waiting for
              something beautiful.
            </p>

            <button
              type="button"
              className="side-drawer__continue"
              onClick={() =>
                setWishlistOpen(false)
              }
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <div className="side-drawer__list">

            {wishlistItems.map((item) => (

              <div
                key={item.id}
                className="wishlist-item"
              >

                {/* PRODUCT IMAGE */}

                <div className="wishlist-item__image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>


                {/* PRODUCT INFORMATION */}

                <div className="wishlist-item__info">

                  <h4>
                    {item.name}
                  </h4>

                  <span className="wishlist-item__price">
                    ₹
                    {Number(item.price || 0)
                      .toLocaleString("en-IN")}
                  </span>


                  {/* ACTIONS */}

                  <div className="wishlist-item__actions">

                    <button
                      type="button"
                      className="wishlist-item__add"
                      onClick={() =>
                        handleAddToCart(item)
                      }
                    >
                      Add to Cart
                    </button>


                    <button
                      type="button"
                      className="wishlist-item__remove"
                      onClick={() =>
                        removeFromWishlist(
                          item.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </aside>
    </>
  );
}