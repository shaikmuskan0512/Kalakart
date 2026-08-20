import { useState } from "react";
import { useApp } from "../store";
import "./CheckoutDrawer.css";

const API_URL = "https://kalakart-y527.onrender.com";

export default function CheckoutDrawer() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cartItems,
    cartSubtotal,
    clearCart,
  } = useApp();

  const userId = localStorage.getItem("userId");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setError("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (!userId) {
      setError("Please login before placing your order.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders/${userId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...address,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      console.log("ORDER CREATED:", data.order);

      // Clear frontend + MongoDB cart
      await clearCart();

      // Close checkout
      setCheckoutOpen(false);

      // Success message
      alert("✓ Order placed successfully!");

    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutOpen) {
    return null;
  }

  return (
    <>
      {/* BACKGROUND OVERLAY */}

      <div
        className="checkout-backdrop"
        onClick={closeCheckout}
      />

      {/* CHECKOUT DRAWER */}

      <aside className="checkout-drawer">

        {/* HEADER */}

        <div className="checkout-drawer-header">
          <div>
            <span className="checkout-eyebrow">
              KALAKART
            </span>

            <h2>Complete Your Order</h2>
          </div>

          <button
            type="button"
            className="checkout-close"
            onClick={closeCheckout}
          >
            ✕
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        {/* CONTENT */}

        <div className="checkout-drawer-content">

          {/* DELIVERY */}

          <section className="checkout-section">

            <h3>Delivery Address</h3>

            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
            >

              <div className="checkout-field">
                <label>Full Name</label>

                <input
                  name="fullName"
                  placeholder="Enter your full name"
                  value={address.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Phone Number</label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={address.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Address</label>

                <textarea
                  name="address"
                  placeholder="House / Street / Area"
                  value={address.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="checkout-two-columns">

                <div className="checkout-field">
                  <label>City</label>

                  <input
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>State</label>

                  <input
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="checkout-field">
                <label>Pincode</label>

                <input
                  name="pincode"
                  type="text"
                  maxLength="6"
                  placeholder="6-digit pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PAYMENT */}

              <h3 className="payment-title">
                Payment Method
              </h3>

              <div className="payment-options">

                <label
                  className={`payment-option ${
                    paymentMethod === "UPI"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={
                      paymentMethod === "UPI"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>UPI</strong>

                    <small>
                      Pay using UPI
                    </small>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order arrives
                    </small>
                  </div>
                </label>

              </div>

            </form>

          </section>

          {/* ORDER SUMMARY */}

          <section className="checkout-summary">

            <div className="checkout-summary-header">

              <h3>Order Summary</h3>

              <span>
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

            <div className="checkout-summary-items">

              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="checkout-item-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.qty}
                    </span>

                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.qty)
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>

              <span>
                ₹
                {Number(
                  cartSubtotal
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="checkout-summary-row">
              <span>Shipping</span>

              <span>FREE</span>
            </div>

            <div className="checkout-total">
              <span>Total</span>

              <strong>
                ₹
                {Number(
                  cartSubtotal
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </section>

        </div>

        {/* FOOTER */}

        <div className="checkout-footer">

          <button
            type="submit"
            form="checkout-form"
            className="place-order-button"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Confirm & Place Order"}
          </button>

        </div>

      </aside>
    </>
  );
}