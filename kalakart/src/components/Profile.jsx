import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  // =========================================
  // LOAD USER
  // =========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Unable to read user:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // =========================================
  // BACK
  // =========================================

  const handleBack = () => {
    navigate(-1);
  };

  // =========================================
  // MY ORDERS
  // =========================================

  const handleMyOrders = () => {
    navigate("/orders");
  };

  // =========================================
  // CONTINUE SHOPPING
  // =========================================

  const handleContinueShopping = () => {
    navigate("/");
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    setSigningOut(true);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 350);
  };

  // =========================================
  // LOADING
  // =========================================

  if (!user) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  // =========================================
  // USER DATA
  // =========================================

  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";

  const initials = firstName
    .charAt(0)
    .toUpperCase();

  const phone =
    user.phone ||
    user.phoneNumber ||
    user.mobile ||
    "Not available";

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="profile-page">

      <div className="profile-content">

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <button
          type="button"
          className="profile-back-button"
          onClick={handleBack}
        >
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>


        {/* =====================================
            PROFILE INTRO
        ===================================== */}

        <section className="profile-intro">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-intro-text">

            <span className="profile-label">
              ACCOUNT
            </span>

            <h1>
              {firstName} {lastName}
            </h1>

            <p>
              Welcome back to your KalaKart account.
            </p>

          </div>

        </section>


        {/* =====================================
            KALAKART BANNER
        ===================================== */}

        <section className="profile-banner">

          <div className="profile-banner-pattern">
            ✦
          </div>

          <div className="profile-banner-content">

            <span>
              KALAKART
            </span>

            <h2>
              Rooted in tradition.
              <br />
              Made for you.
            </h2>

            <p>
              Discover handcrafted treasures
              inspired by India's rich heritage.
            </p>

          </div>

          <div className="profile-banner-mark">
            ✦
          </div>

        </section>


        {/* =====================================
            ACCOUNT DETAILS
        ===================================== */}

        <section className="profile-details-section">

          <div className="profile-section-heading">

            <span>
              ACCOUNT INFORMATION
            </span>

            <h2>
              Your Details
            </h2>

          </div>


          <div className="profile-details-grid">

            {/* FIRST NAME */}

            <div className="profile-detail">

              <span>
                FIRST NAME
              </span>

              <strong>
                {user.firstName || "Not available"}
              </strong>

            </div>


            {/* LAST NAME */}

            <div className="profile-detail">

              <span>
                LAST NAME
              </span>

              <strong>
                {user.lastName || "Not available"}
              </strong>

            </div>


            {/* EMAIL */}

            <div className="profile-detail">

              <span>
                EMAIL ADDRESS
              </span>

              <strong>
                {user.email || "Not available"}
              </strong>

            </div>


            {/* PHONE */}

            <div className="profile-detail">

              <span>
                PHONE NUMBER
              </span>

              <strong>
                {phone}
              </strong>

            </div>

          </div>

        </section>


        {/* =====================================
            ACTION BUTTONS
        ===================================== */}

        <section className="profile-actions">

          {/* ===================================
              PREVIOUS ORDERS
          =================================== */}

          <button
            type="button"
            className="profile-action profile-orders"
            onClick={handleMyOrders}
          >

            <span className="profile-action-icon">

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M4.5 7.5L12 12l7.5-4.5M12 12v9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

            </span>

            <span className="profile-action-text">

              <strong>
                Previous Orders
              </strong>

              <small>
                View your KalaKart purchases
              </small>

            </span>

            <span className="profile-action-arrow">
              →
            </span>

          </button>


          {/* ===================================
              CONTINUE SHOPPING
          =================================== */}

          <button
            type="button"
            className="profile-action profile-shopping"
            onClick={handleContinueShopping}
          >

            <span className="profile-action-icon">

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 8h12l-1 12H7L6 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M9 8V6a3 3 0 0 1 6 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

            </span>

            <span className="profile-action-text">

              <strong>
                Continue Shopping
              </strong>

              <small>
                Explore handcrafted collections
              </small>

            </span>

            <span className="profile-action-arrow">
              →
            </span>

          </button>

        </section>


        {/* =====================================
            SIGN OUT
        ===================================== */}

        <div className="profile-signout-wrapper">

          <button
            type="button"
            className={`profile-signout ${
              signingOut ? "is-signing-out" : ""
            }`}
            onClick={handleLogout}
            disabled={signingOut}
          >

            <span className="signout-icon">
              ↪
            </span>

            <span>
              {signingOut
                ? "Signing out..."
                : "Sign out"}
            </span>

          </button>

        </div>

      </div>

    </main>
  );
}