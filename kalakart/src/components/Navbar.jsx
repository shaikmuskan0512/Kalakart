import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store";
import WishlistDrawer from "./WishlistDrawer";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#shop" },
  { label: "Categories", href: "#categories" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const {
    search,
    setSearch,
    wishlistItems,
    wishlistOpen,
    setWishlistOpen,
    cartCount,
    setCartOpen,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // =========================================
  // LOAD USER
  // =========================================

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Invalid user data");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // =========================================
  // SCROLL
  // =========================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // =========================================
  // CLOSE PROFILE WITH ESC
  // =========================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setWishlistOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setWishlistOpen]);

  // =========================================
  // PREVENT BODY SCROLL WHEN DRAWER OPEN
  // =========================================

  useEffect(() => {
    if (profileOpen || wishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [profileOpen, wishlistOpen]);

  // =========================================
  // SHOP
  // =========================================

  const goToShop = () => {
    setMobileOpen(false);

    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);
    setWishlistOpen(false);
    setMobileOpen(false);

    navigate("/auth", {
      replace: true,
    });
  };

  // =========================================
  // PROFILE CLICK
  // =========================================

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // Not logged in
    if (!token || !savedUser) {
      setProfileOpen(false);
      navigate("/auth");
      return;
    }

    // Load latest user
    try {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid saved user");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      setUser(null);
      setProfileOpen(false);

      navigate("/auth");

      return;
    }

    setProfileOpen(true);
    setWishlistOpen(false);
    setMobileOpen(false);
  };

  // =========================================
  // PROFILE CLOSE
  // =========================================

  const closeProfile = () => {
    setProfileOpen(false);
  };

  // =========================================
  // WISHLIST CLICK
  // =========================================

  const handleWishlistClick = () => {
    setWishlistOpen(true);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  // =========================================
  // CLOSE WISHLIST
  // =========================================

  const closeWishlist = () => {
    setWishlistOpen(false);
  };

  // =========================================
  // MY PROFILE
  // =========================================

  const handleMyProfile = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/profile");
  };

  // =========================================
  // PREVIOUS ORDERS
  // =========================================

  const handlePreviousOrders = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/orders");
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      {/* =========================================
          NAVBAR
      ========================================= */}

      <header
        className={`navbar ${
          scrolled ? "navbar--scrolled" : ""
        }`}
      >
        <div className="container navbar__inner">

          {/* =====================================
              LOGO
          ===================================== */}

          <a
            href="#home"
            className="navbar__logo"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
              setWishlistOpen(false);
            }}
          >
            <span className="navbar__logo-icon">
              ✦
            </span>

            <span>KalaKart</span>
          </a>


          {/* =====================================
              DESKTOP NAVIGATION
          ===================================== */}

          <nav className="navbar__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false);
                  setProfileOpen(false);
                  setWishlistOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>


          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="navbar__actions">

            {/* ===================================
                SEARCH
            =================================== */}

            <div className="navbar__search">

              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />

                <path
                  d="M11 11l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="text"
                placeholder="Search sarees, crafts, states…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  if (e.target.value) {
                    goToShop();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goToShop();
                  }
                }}
              />

            </div>


            {/* ===================================
                MOBILE SEARCH
            =================================== */}

            <button
              type="button"
              className="navbar__search-icon-btn"
              aria-label="Search"
              onClick={() =>
                setMobileSearchOpen(
                  (value) => !value
                )
              }
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />

                <path
                  d="M11 11l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>


            {/* ===================================
                WISHLIST
            =================================== */}

            <button
              type="button"
              className={`navbar__icon-btn ${
                wishlistOpen
                  ? "navbar__icon-btn--active"
                  : ""
              }`}
              aria-label="Wishlist"
              title="Wishlist"
              onClick={handleWishlistClick}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill={
                  wishlistOpen
                    ? "currentColor"
                    : "none"
                }
              >
                <path
                  d="M12 20.5s-7.6-4.6-10-9.3C.4 7.7 2 4 5.8 4c2.2 0 3.7 1.2 4.6 2.6C11.3 5.2 12.8 4 15 4c3.8 0 5.4 3.7 3.8 7.2-2.4 4.7-10 9.3-10 9.3Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>

              {wishlistItems.length > 0 && (
                <span className="navbar__badge">
                  {wishlistItems.length}
                </span>
              )}
            </button>


            {/* ===================================
                CART
            =================================== */}

            <button
              type="button"
              className="navbar__icon-btn"
              aria-label="Cart"
              title="Cart"
              onClick={() => {
                setCartOpen(true);
                setProfileOpen(false);
                setWishlistOpen(false);
              }}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20.5L6 8Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />

                <path
                  d="M9 8V6.5a3 3 0 0 1 6 0V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>

              {cartCount > 0 && (
                <span className="navbar__badge">
                  {cartCount}
                </span>
              )}
            </button>


            {/* ===================================
                PROFILE
            =================================== */}

            <button
              type="button"
              className="navbar__icon-btn navbar__login-btn"
              aria-label="Profile"
              title={
                user
                  ? "My Profile"
                  : "Login / Sign Up"
              }
              onClick={(event) => {
                event.stopPropagation();
                handleProfileClick();
              }}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />

                <path
                  d="M5 20c.7-3.4 3.2-5.5 7-5.5s6.3 2.1 7 5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>


            {/* ===================================
                HAMBURGER
            =================================== */}

            <button
              type="button"
              className={`navbar__hamburger ${
                mobileOpen ? "is-open" : ""
              }`}
              aria-label="Menu"
              onClick={() =>
                setMobileOpen(
                  (value) => !value
                )
              }
            >
              <span />
              <span />
              <span />
            </button>

          </div>
        </div>


        {/* =========================================
            MOBILE SEARCH
        ========================================= */}

        {mobileSearchOpen && (
          <div className="navbar__mobile-search container">

            <input
              type="text"
              autoFocus
              placeholder="Search sarees, crafts, states…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                if (e.target.value) {
                  goToShop();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToShop();
                }
              }}
            />

          </div>
        )}


        {/* =========================================
            MOBILE MENU
        ========================================= */}

        <div
          className={`navbar__mobile-menu ${
            mobileOpen ? "is-open" : ""
          }`}
        >

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setMobileOpen(false);
                setProfileOpen(false);
                setWishlistOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}


          {/* MOBILE WISHLIST */}

          <button
            type="button"
            className="mobile-wishlist-button"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
              setWishlistOpen(true);
            }}
          >
            ♡ Wishlist

            {wishlistItems.length > 0 && (
              <span>
                {wishlistItems.length}
              </span>
            )}
          </button>


          {/* MOBILE PROFILE */}

          <button
            type="button"
            className="mobile-profile-button"
            onClick={() => {
              setMobileOpen(false);

              if (!localStorage.getItem("token")) {
                navigate("/auth");
                return;
              }

              setProfileOpen(true);
            }}
          >
            {user
              ? "My Profile"
              : "Login / Sign Up"}
          </button>


          {/* MOBILE ORDERS */}

          {user && (
            <button
              type="button"
              className="mobile-orders-button"
              onClick={handlePreviousOrders}
            >
              📦 Previous Orders
            </button>
          )}

        </div>

      </header>


      {/* =================================================
          WISHLIST DRAWER
      ================================================= */}

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={closeWishlist}
      />


      {/* =================================================
          PROFILE DRAWER
      ================================================= */}

      {profileOpen && user && (
        <>
          {/* =========================================
              BACKGROUND OVERLAY
          ========================================= */}

          <div
            className="profile-drawer-backdrop"
            onClick={closeProfile}
          />


          {/* =========================================
              DRAWER
          ========================================= */}

          <aside
            className="profile-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="profile-drawer-header">

              <div>
                <span className="profile-drawer-label">
                  MY ACCOUNT
                </span>

                <h2>
                  Profile
                </h2>
              </div>

              <button
                type="button"
                className="profile-drawer-close"
                onClick={closeProfile}
                aria-label="Close profile"
              >
                ×
              </button>

            </div>


            {/* =====================================
                ACCOUNT INTRO
            ===================================== */}

            <div className="profile-drawer-account">

              <div className="profile-drawer-avatar">
                {user.firstName
                  ? user.firstName
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="profile-drawer-user">

                <h3>
                  {user.firstName || "User"}{" "}
                  {user.lastName || ""}
                </h3>

                <p>
                  {user.email ||
                    "Email not available"}
                </p>

              </div>

            </div>


            {/* =====================================
                ACCOUNT DETAILS
            ===================================== */}

            <div className="profile-drawer-details">

              <div className="profile-drawer-section-title">
                ACCOUNT DETAILS
              </div>

              <div className="profile-drawer-detail">

                <span>
                  Full Name
                </span>

                <strong>
                  {user.firstName
                    ? `${user.firstName} ${
                        user.lastName || ""
                      }`
                    : "Not available"}
                </strong>

              </div>

              <div className="profile-drawer-detail">

                <span>
                  Email Address
                </span>

                <strong>
                  {user.email ||
                    "Not available"}
                </strong>

              </div>

            </div>


            {/* =====================================
                MENU
            ===================================== */}

            <div className="profile-drawer-menu">

              {/* MY PROFILE */}

              <button
                type="button"
                onClick={handleMyProfile}
              >

                <span className="drawer-menu-icon">
                  👤
                </span>

                <span className="drawer-menu-content">

                  <strong>
                    My Profile
                  </strong>

                  <small>
                    View and edit your profile
                  </small>

                </span>

                <span className="drawer-menu-arrow">
                  →
                </span>

              </button>


              {/* PREVIOUS ORDERS */}

              <button
                type="button"
                onClick={handlePreviousOrders}
              >

                <span className="drawer-menu-icon">
                  📦
                </span>

                <span className="drawer-menu-content">

                  <strong>
                    Previous Orders
                  </strong>

                  <small>
                    View your previous purchases
                  </small>

                </span>

                <span className="drawer-menu-arrow">
                  →
                </span>

              </button>

            </div>


            {/* =====================================
                KALAKART WELCOME
            ===================================== */}

            <div className="profile-drawer-welcome">

              <div className="profile-drawer-welcome-title">

                <span>✦</span>

                <span>
                  Welcome to KalaKart
                </span>

              </div>

              <p>
                Discover India's beautiful
                handlooms, handicrafts and
                timeless traditions.
              </p>

            </div>


            {/* =====================================
                SIGN OUT
            ===================================== */}

            <div className="profile-drawer-bottom">

              <button
                type="button"
                className="profile-drawer-logout"
                onClick={handleLogout}
              >
                <span className="logout-icon">
                  ↪
                </span>

                <span>
                  Sign Out
                </span>

              </button>

            </div>

          </aside>
        </>
      )}

    </>
  );
}