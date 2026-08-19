import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store";
import "./Checkout.css";
const API_URL = "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartSubtotal,
    clearCart,
  } = useApp();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderNumber, setOrderNumber] =
    useState("");

  const [error, setError] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");

    // ------------------------------------------
    // LOGIN CHECK
    // ------------------------------------------

    if (!userId || !token) {
      setError(
        "Please login before placing your order."
      );
      return;
    }

    // ------------------------------------------
    // CART CHECK
    // ------------------------------------------

    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      setError("Your cart is empty.");
      return;
    }

    // ------------------------------------------
    // FORM VALIDATION
    // ------------------------------------------

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError(
        "Please fill in all delivery details."
      );
      return;
    }

    // ------------------------------------------
    // PHONE VALIDATION
    // ------------------------------------------

    if (
      !/^[0-9]{10}$/.test(
        form.phone.trim()
      )
    ) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // ------------------------------------------
    // PINCODE VALIDATION
    // ------------------------------------------

    if (
      !/^[0-9]{6}$/.test(
        form.pincode.trim()
      )
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    // ------------------------------------------
    // START ORDER
    // ------------------------------------------

    setPlacingOrder(true);

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${userId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName:
              form.fullName.trim(),

            phone:
              form.phone.trim(),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.trim(),

            paymentMethod,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "ORDER RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        );
      }

      // ----------------------------------------
      // SAVE ORDER ID
      // ----------------------------------------

      if (data.order?._id) {
        setOrderNumber(
          data.order._id
        );
      }

      // ----------------------------------------
      // CLEAR CART
      // ----------------------------------------

      await clearCart();

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      setOrderPlaced(true);

    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to place order. Please try again."
      );

    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // CONTINUE SHOPPING
  // ==========================================

  const continueBrowsing = () => {
    navigate("/");
  };

  // ==========================================
  // PREVIOUS ORDERS
  // ==========================================

  const viewOrders = () => {
    navigate("/orders");
  };

  // ==========================================
  // SUCCESS PAGE
  // ==========================================

  if (orderPlaced) {
    return (
      <div className="checkout-page">

        <div className="checkout-success-page">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Order Placed Successfully!
          </h1>

          <p className="success-text">
            Thank you for shopping with
            KalaKart.
          </p>

          <p className="success-subtext">
            Your order has been confirmed
            and will be prepared by our
            artisans with care.
          </p>

          {orderNumber && (
            <div className="order-id-box">

              <span>
                Order ID
              </span>

              <strong>
                #
                {orderNumber
                  .slice(-8)
                  .toUpperCase()}
              </strong>

            </div>
          )}

          <div className="success-buttons">

            <button
              type="button"
              className="success-primary"
              onClick={
                viewOrders
              }
            >
              Previous Orders
            </button>

            <button
              type="button"
              className="success-secondary"
              onClick={
                continueBrowsing
              }
            >
              Continue Browsing
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="checkout-page-header">

          <div>

            <span className="checkout-brand">
              KALAKART
            </span>

            <h1>
              Complete Your Order
            </h1>

            <p>
              Enter your delivery details
              and choose your payment method.
            </p>

          </div>

          <button
            type="button"
            className="back-shopping-button"
            onClick={() =>
              navigate("/")
            }
          >
            ← Continue Shopping
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        {/* ======================================
            MAIN
        ====================================== */}

        <div className="checkout-layout">

          {/* ====================================
              LEFT
          ==================================== */}

          <form
            className="checkout-form"
            onSubmit={
              handlePlaceOrder
            }
          >

            {/* DELIVERY */}

            <section className="checkout-section">

              <h2>
                Delivery Details
              </h2>

              <div className="checkout-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    form.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                />

              </div>

              <div className="checkout-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />

              </div>

              <div className="checkout-field">

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House / Street / Area"
                  rows="4"
                />

              </div>

              <div className="checkout-row">

                <div className="checkout-field">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                  />

                </div>

                <div className="checkout-field">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                  />

                </div>

              </div>

              <div className="checkout-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="6-digit pincode"
                  maxLength="6"
                />

              </div>

            </section>

            {/* =================================
                PAYMENT
            ================================= */}

            <section className="checkout-section">

              <h2>
                Payment Method
              </h2>

              <label
                className={
                  `payment-option ${
                    paymentMethod === "UPI"
                      ? "selected"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "UPI"
                    )
                  }
                />

                <div>

                  <strong>
                    UPI
                  </strong>

                  <span>
                    Pay securely using UPI
                  </span>

                </div>

              </label>

              <label
                className={
                  `payment-option ${
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "selected"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "Cash on Delivery"
                    )
                  }
                />

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

              </label>

            </section>

            {/* =================================
                CONFIRM
            ================================= */}

            <button
              type="submit"
              className="place-order-button"
              disabled={
                placingOrder
              }
            >

              {placingOrder
                ? "Placing Order..."
                : "Confirm & Place Order"}

            </button>

          </form>

          {/* ====================================
              RIGHT ORDER SUMMARY
          ==================================== */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            {cartItems &&
              cartItems.length > 0 &&
              cartItems.map(
                (item, index) => {

                  const product =
                    item.product ||
                    item;

                  const quantity =
                    item.quantity ||
                    item.qty ||
                    1;

                  const price =
                    Number(
                      product.price ||
                        item.price ||
                        0
                    );

                  return (
                    <div
                      className="summary-item"
                      key={
                        product._id ||
                        product.id ||
                        index
                      }
                    >

                      <div>

                        <strong>
                          {
                            product.name ||
                            "Product"
                          }
                        </strong>

                        <span>
                          Qty: {quantity}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {(
                          price *
                          quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

            <div className="summary-line">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {Number(
                  cartSubtotal
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-line">

              <span>
                Shipping
              </span>

              <strong>
                FREE
              </strong>

            </div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {Number(
                  cartSubtotal
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="secure-note">
              🔒 Your order information
              is securely processed.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}