import { useEffect, useState } from "react";
import { useApp } from "../store";
import "./Drawer.css";
import "./PreviousOrdersDrawer.css";

const API_URL = "http://localhost:5000";

export default function PreviousOrdersDrawer() {

  const {
    ordersOpen,
    setOrdersOpen,
  } = useApp();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {

    if (!ordersOpen) {
      return;
    }

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");

    if (!userId || !token) {
      setError(
        "Please login to view your orders."
      );
      return;
    }

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/orders/user/${userId}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch orders"
          );
        }

        setOrders(
          data.orders || []
        );

      } catch (error) {

        console.error(
          "Orders error:",
          error
        );

        setError(
          error.message ||
            "Failed to load orders"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchOrders();

  }, [ordersOpen]);

  // ==========================================
  // CLOSE
  // ==========================================

  const closeDrawer = () => {
    setOrdersOpen(false);
  };

  return (
    <>
      {/* BACKDROP */}

      <div
        className={`drawer-backdrop ${
          ordersOpen
            ? "is-open"
            : ""
        }`}
        onClick={closeDrawer}
      />

      {/* DRAWER */}

      <aside
        className={`side-drawer orders-drawer ${
          ordersOpen
            ? "is-open"
            : ""
        }`}
      >

        {/* HEADER */}

        <div className="side-drawer__header">

          <div>
            <h3>
              Previous Orders
            </h3>

            <p className="orders-header-subtitle">
              Your KalaKart purchases
            </p>
          </div>

          <button
            onClick={closeDrawer}
            aria-label="Close orders"
          >
            ✕
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="orders-drawer-message">
            Loading your orders...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="orders-drawer-message orders-drawer-error">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="orders-drawer-message">

              <div className="orders-empty-icon">
                📦
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Your previous purchases
                will appear here.
              </p>

            </div>
          )}

        {/* ORDERS */}

        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="orders-drawer-list">

              {orders.map((order) => (

                <div
                  className="previous-order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="previous-order-top">

                    <div>

                      <h4>
                        Order #
                        {order._id.slice(-8)}
                      </h4>

                      <span>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>

                    <span
                      className={`previous-order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* ITEMS */}

                  <div className="previous-order-items">

                    {order.items.map(
                      (item, index) => {

                        const product =
                          item.product;

                        return (
                          <div
                            className="previous-order-item"
                            key={index}
                          >

                            {product?.image && (
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name ||
                                  "Product"
                                }
                              />
                            )}

                            <div className="previous-order-item-info">

                              <strong>
                                {
                                  product?.name ||
                                  "Product"
                                }
                              </strong>

                              <span>
                                Qty:{" "}
                                {
                                  item.quantity
                                }
                              </span>

                            </div>

                            <span className="previous-order-item-price">
                              ₹
                              {(
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* ADDRESS */}

                  <div className="previous-order-address">

                    <strong>
                      Delivery Address
                    </strong>

                    <p>
                      {
                        order.shippingAddress
                          ?.fullName
                      }
                      <br />

                      {
                        order.shippingAddress
                          ?.address
                      }
                      <br />

                      {
                        order.shippingAddress
                          ?.city
                      }
                      ,{" "}
                      {
                        order.shippingAddress
                          ?.state
                      }{" "}
                      -{" "}
                      {
                        order.shippingAddress
                          ?.pincode
                      }
                    </p>

                  </div>

                  {/* PAYMENT */}

                  <div className="previous-order-payment">

                    <span>
                      Payment
                    </span>

                    <strong>
                      {order.paymentMethod}
                    </strong>

                  </div>

                  {/* TOTAL */}

                  <div className="previous-order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

      </aside>
    </>
  );
}