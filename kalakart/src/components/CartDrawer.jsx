import { useApp } from "../store";
import { useNavigate } from "react-router-dom";
import "./Drawer.css";
import "./CartDrawer.css";

export default function CartDrawer() {
  const navigate = useNavigate();

  const {
    cartOpen,
    setCartOpen,
    cartItems,
    removeFromCart,
    updateQty,
    cartSubtotal,
  } = useApp();

  // ==========================================
  // PROCEED TO CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");

    // LOGIN CHECK
    if (!userId || !token) {
      alert("Please login before checkout");
      return;
    }

    // CART CHECK
    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      alert("Your cart is empty");
      return;
    }

    // CLOSE CART
    setCartOpen(false);

    // GO TO CHECKOUT PAGE
    navigate("/checkout");
  };

  // ==========================================
  // CART CLOSED
  // ==========================================

  if (!cartOpen) {
    return null;
  }

  return (
    <>
      {/* ======================================
          BACKDROP
      ====================================== */}

      <div
        className="drawer-backdrop is-open"
        onClick={() =>
          setCartOpen(false)
        }
      />

      {/* ======================================
          CART DRAWER
      ====================================== */}

      <aside
        className="side-drawer is-open"
        aria-label="Shopping cart"
      >

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="side-drawer__header">

          <h3>
            Your Bag (
            {cartItems.reduce(
              (total, item) =>
                total +
                Number(
                  item.qty || 0
                ),
              0
            )}
            )
          </h3>

          <button
            type="button"
            onClick={() =>
              setCartOpen(false)
            }
            aria-label="Close cart"
          >
            ✕
          </button>

        </div>

        {/* ====================================
            EMPTY CART
        ==================================== */}

        {cartItems.length === 0 ? (

          <div className="side-drawer__empty">

            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
            >

              <path
                d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20.5L6 8Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />

              <path
                d="M9 8V6.5a3 3 0 0 1 6 0V8"
                stroke="currentColor"
                strokeWidth="1.3"
              />

            </svg>

            <p>
              Your bag is empty.
              <br />
              Time to find something beautiful.
            </p>

          </div>

        ) : (

          <>
            {/* ==================================
                CART ITEMS
            ================================== */}

            <div className="side-drawer__list">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="cart-item"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item__info">

                    <h4>
                      {item.name}
                    </h4>

                    <span className="cart-item__price">
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {/* QUANTITY */}

                    <div className="cart-item__qty">

                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.id,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.id,
                            1
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() =>
                          removeFromCart(
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

            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="cart-summary">

              <div className="cart-summary__row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    cartSubtotal
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="cart-summary__row">

                <span>
                  Shipping
                </span>

                <span>
                  FREE
                </span>

              </div>

              <div className="cart-summary__row cart-summary__row--total">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {Number(
                    cartSubtotal
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* =================================
                  PROCEED TO CHECKOUT
              ================================= */}

              <button
                type="button"
                className="btn btn-primary cart-summary__checkout"
                onClick={
                  handleCheckout
                }
              >
                Proceed to Checkout
              </button>

            </div>

          </>

        )}

      </aside>
    </>
  );
}