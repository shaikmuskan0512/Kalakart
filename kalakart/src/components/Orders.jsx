import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const API_URL = "https://kalakart-y527.onrender.com";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    const loadOrders = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/orders/user/${userId}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();

          throw new Error(
            text || `Server returned ${response.status}`
          );
        }

        console.log("ORDERS RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      } catch (error) {
        console.error("Orders error:", error);

        setError(
          error.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CONTINUE SHOPPING
  // ==========================================

  const continueBrowsing = () => {
    navigate("/");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const goToLogin = () => {
    navigate("/auth");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="orders-page">

      <div className="orders-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="orders-header">

          <div>

            <span className="orders-eyebrow">
              MY ACCOUNT
            </span>

            <h1>
              Previous Orders
            </h1>

            <p>
              View your KalaKart purchases
              and order details.
            </p>

          </div>

          <button
            type="button"
            onClick={continueBrowsing}
            className="orders-shop-button"
          >
            Continue Browsing
          </button>

        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="orders-message">

            <div className="orders-loading-icon">
              🛍
            </div>

            <p>
              Loading your orders...
            </p>

          </div>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <div className="orders-message error">

            <div className="orders-error-icon">
              !
            </div>

            <h2>
              Unable to load orders
            </h2>

            <p>
              {error}
            </p>

            {!localStorage.getItem("token") && (
              <button
                type="button"
                onClick={goToLogin}
              >
                Login
              </button>
            )}

          </div>
        )}

        {/* ======================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          orders.length === 0 && (

            <div className="orders-empty">

              <div className="orders-empty-icon">
                🛍
              </div>

              <h2>
                No orders yet
              </h2>

              <p>
                Your beautiful KalaKart
                journey starts here.
              </p>

              <button
                type="button"
                onClick={continueBrowsing}
              >
                Start Shopping
              </button>

            </div>
          )}

        {/* ======================================
            ORDERS
        ====================================== */}

        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="orders-list">

              {orders.map((order) => (

                <div
                  className="order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>

                      <span>
                        ORDER #
                        {order._id
                          ? order._id
                              .slice(-8)
                              .toUpperCase()
                          : "UNKNOWN"}
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                    </div>

                    <div className="order-status">
                      {order.status || "Placed"}
                    </div>

                  </div>

                  {/* ORDER ITEMS */}

                  <div className="order-items">

                    {Array.isArray(order.items) &&
                      order.items.map(
                        (item, index) => {

                          const product =
                            item.product || {};

                          const quantity =
                            Number(
                              item.quantity || 1
                            );

                          const price =
                            Number(
                              item.price ||
                                product.price ||
                                0
                            );

                          return (
                            <div
                              className="order-item"
                              key={
                                item._id ||
                                index
                              }
                            >

                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                />
                              ) : (
                                <div className="order-item-image-placeholder">
                                  🛍
                                </div>
                              )}

                              <div className="order-item-info">

                                <h3>
                                  {product.name ||
                                    "KalaKart Product"}
                                </h3>

                                <p>
                                  Qty: {quantity}
                                </p>

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

                  </div>

                  {/* ORDER FOOTER */}

                  <div className="order-card-footer">

                    <div>

                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod ||
                          "Cash on Delivery"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* DELIVERY */}

                  {order.shippingAddress && (
                    <div className="order-address">

                      <span>
                        Delivery Address
                      </span>

                      <p>

                        {order.shippingAddress
                          .fullName && (
                          <>
                            <strong>
                              {
                                order
                                  .shippingAddress
                                  .fullName
                              }
                            </strong>
                            <br />
                          </>
                        )}

                        {order.shippingAddress
                          .address && (
                          <>
                            {
                              order
                                .shippingAddress
                                .address
                            }
                            <br />
                          </>
                        )}

                        {order.shippingAddress
                          .city && (
                          <>
                            {
                              order
                                .shippingAddress
                                .city
                            }

                            {order
                              .shippingAddress
                              .state
                              ? `, ${order.shippingAddress.state}`
                              : ""}

                            {order
                              .shippingAddress
                              .pincode
                              ? ` - ${order.shippingAddress.pincode}`
                              : ""}
                          </>
                        )}

                      </p>

                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

      </div>

    </div>
  );
}