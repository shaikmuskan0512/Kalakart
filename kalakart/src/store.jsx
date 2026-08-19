import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { products as allProducts } from "./data/products";

const AppContext = createContext(null);

// ==========================================
// BACKEND URL
// ==========================================

const API_URL = "http://localhost:5000";

// ==========================================
// APP PROVIDER
// ==========================================

export function AppProvider({ children }) {

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const isLoggedIn = !!token;

  // ==========================================
  // LOGIN
  // ==========================================

  const login = useCallback(
    (
      loginToken,
      loginUser = null,
      loginUserId = null
    ) => {

      localStorage.setItem(
        "token",
        loginToken
      );

      setToken(loginToken);

      if (loginUserId) {
        localStorage.setItem(
          "userId",
          loginUserId
        );

        setUserId(loginUserId);
      }

      if (loginUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(loginUser)
        );

        setUser(loginUser);
      }
    },
    []
  );

  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] =
    useState(false);

  // Kept for compatibility with
  // any old components.
  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  // ==========================================
  // WISHLIST
  // ==========================================

  const [wishlist, setWishlist] =
    useState(() => {

      try {
        const savedWishlist =
          localStorage.getItem(
            "wishlist"
          );

        return savedWishlist
          ? JSON.parse(savedWishlist)
          : [];

      } catch {
        return [];
      }

    });

  const [wishlistOpen, setWishlistOpen] =
    useState(false);

  // ==========================================
  // SEARCH & FILTERS
  // ==========================================

  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [maxPrice, setMaxPrice] =
    useState(10000);

  const [activeStates, setActiveStates] =
    useState([]);

  const [minRating, setMinRating] =
    useState(0);

  const [sortBy, setSortBy] =
    useState("recommended");

  const [filterDrawerOpen, setFilterDrawerOpen] =
    useState(false);

  // ==========================================
  // TOAST
  // ==========================================

  const [toasts, setToasts] =
    useState([]);

  const toastId = useRef(0);

  const showToast = useCallback(
    (message) => {

      const id =
        ++toastId.current;

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter(
            (toast) =>
              toast.id !== id
          )
        );
      }, 2800);

    },
    []
  );

  const dismissToast =
    useCallback((id) => {

      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );

    }, []);

  // ==========================================
  // RESPONSE HELPER
  // ==========================================

  const getResponseData =
    async (response) => {

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        return await response.json();
      }

      const text =
        await response.text();

      return {
        message:
          text ||
          `Server returned ${response.status}`,
      };
    };

  // ==========================================
  // FORMAT BACKEND CART
  // ==========================================

  const formatCart = useCallback(
    (items = []) => {

      return items
        .map((item) => {

          const product =
            item.product;

          if (!product) {
            return null;
          }

          return {
            id:
              product.productId ??
              product.id ??
              product._id,

            qty: Number(
              item.quantity || 1
            ),
          };

        })
        .filter(
          (item) =>
            item &&
            item.id !== undefined &&
            item.id !== null
        );

    },
    []
  );

  // ==========================================
  // LOAD CART FROM MONGODB
  // ==========================================

  useEffect(() => {

    const loadCart =
      async () => {

        if (!userId) {
          setCart([]);
          return;
        }

        try {

          console.log(
            "Loading cart for user:",
            userId
          );

          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}`,
              {
                method: "GET",

                headers: {
                  "Content-Type":
                    "application/json",

                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },
              }
            );

          const data =
            await getResponseData(
              response
            );

          console.log(
            "CART LOAD RESPONSE:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to fetch cart"
            );
          }

          setCart(
            formatCart(
              data.items || []
            )
          );

        } catch (error) {

          console.error(
            "Load cart error:",
            error
          );

          setCart([]);

        }

      };

    loadCart();

  }, [
    userId,
    token,
    formatCart,
  ]);

  // ==========================================
  // CART - ADD
  // ==========================================

  const addToCart =
    useCallback(
      async (product) => {

        if (!product) {
          return;
        }

        if (!userId) {

          showToast(
            "Please login first"
          );

          return;
        }

        try {

          console.log(
            "Adding product:",
            product.id
          );

          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },

                body: JSON.stringify({
                  productId:
                    product.id,

                  quantity: 1,
                }),
              }
            );

          const data =
            await getResponseData(
              response
            );

          console.log(
            "ADD CART RESPONSE:",
            data
          );

          if (!response.ok) {

            throw new Error(
              data.message ||
                "Failed to add to cart"
            );

          }

          setCart(
            formatCart(
              data.items || []
            )
          );

          showToast(
            "✓ Added to cart"
          );

        } catch (error) {

          console.error(
            "Add to cart error:",
            error
          );

          showToast(
            error.message ||
              "Failed to add to cart"
          );

        }

      },
      [
        userId,
        token,
        showToast,
        formatCart,
      ]
    );

  // ==========================================
  // CART - REMOVE
  // ==========================================

  const removeFromCart =
    useCallback(
      async (id) => {

        if (!userId) {
          return;
        }

        try {

          console.log(
            "Removing product:",
            id
          );

          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}/${id}`,
              {
                method: "DELETE",

                headers: {
                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },
              }
            );

          const data =
            await getResponseData(
              response
            );

          console.log(
            "REMOVE CART RESPONSE:",
            data
          );

          if (!response.ok) {

            throw new Error(
              data.message ||
                "Failed to remove from cart"
            );

          }

          setCart(
            formatCart(
              data.items || []
            )
          );

          showToast(
            "✓ Removed from cart"
          );

        } catch (error) {

          console.error(
            "Remove cart error:",
            error
          );

          showToast(
            error.message ||
              "Failed to remove from cart"
          );

        }

      },
      [
        userId,
        token,
        showToast,
        formatCart,
      ]
    );

  // ==========================================
  // CART - CLEAR
  // ==========================================

  const clearCart =
    useCallback(
      async () => {

        // Immediately clear frontend
        // so the UI becomes empty.
        setCart([]);

        if (!userId) {
          return true;
        }

        try {

          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}/clear`,
              {
                method: "DELETE",

                headers: {
                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },
              }
            );

          const data =
            await getResponseData(
              response
            );

          console.log(
            "CLEAR CART RESPONSE:",
            data
          );

          if (!response.ok) {

            throw new Error(
              data.message ||
                "Failed to clear cart"
            );

          }

          setCart([]);

          return true;

        } catch (error) {

          console.error(
            "Clear cart error:",
            error
          );

          // Keep frontend cart empty
          // even if backend clear fails.
          setCart([]);

          showToast(
            error.message ||
              "Cart cleared locally"
          );

          return false;
        }

      },
      [
        userId,
        token,
        showToast,
      ]
    );

  // ==========================================
  // CART - UPDATE QUANTITY
  // ==========================================

  const updateQty =
    useCallback(
      async (id, delta) => {

        if (!userId) {
          return;
        }

        const currentItem =
          cart.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        if (!currentItem) {
          return;
        }

        const newQty =
          Math.max(
            1,
            Number(
              currentItem.qty
            ) +
              Number(delta)
          );

        try {

          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}/${id}`,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",

                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },

                body: JSON.stringify({
                  quantity:
                    newQty,
                }),
              }
            );

          const data =
            await getResponseData(
              response
            );

          console.log(
            "UPDATE CART RESPONSE:",
            data
          );

          if (!response.ok) {

            throw new Error(
              data.message ||
                "Failed to update quantity"
            );

          }

          setCart(
            formatCart(
              data.items || []
            )
          );

        } catch (error) {

          console.error(
            "Update quantity error:",
            error
          );

          showToast(
            error.message ||
              "Failed to update quantity"
          );

        }

      },
      [
        userId,
        token,
        cart,
        showToast,
        formatCart,
      ]
    );

  // ==========================================
  // WISHLIST - TOGGLE
  // ==========================================

  const toggleWishlist =
    useCallback(
      (product) => {

        if (!product) {
          return;
        }

        setWishlist((prev) => {

          const exists =
            prev.includes(
              product.id
            );

          let updatedWishlist;

          if (exists) {

            updatedWishlist =
              prev.filter(
                (id) =>
                  id !== product.id
              );

            showToast(
              "♡ Removed from wishlist"
            );

          } else {

            updatedWishlist = [
              ...prev,
              product.id,
            ];

            showToast(
              "♥ Added to wishlist"
            );

          }

          localStorage.setItem(
            "wishlist",
            JSON.stringify(
              updatedWishlist
            )
          );

          return updatedWishlist;

        });

      },
      [showToast]
    );

  // ==========================================
  // WISHLIST - REMOVE
  // ==========================================

  const removeFromWishlist =
    useCallback(
      (id) => {

        setWishlist((prev) => {

          const updatedWishlist =
            prev.filter(
              (productId) =>
                productId !== id
            );

          localStorage.setItem(
            "wishlist",
            JSON.stringify(
              updatedWishlist
            )
          );

          return updatedWishlist;

        });

        showToast(
          "♡ Removed from wishlist"
        );

      },
      [showToast]
    );

  // ==========================================
  // WISHLIST - CLEAR
  // ==========================================

  const clearWishlist =
    useCallback(() => {

      setWishlist([]);

      localStorage.removeItem(
        "wishlist"
      );

      showToast(
        "✓ Wishlist cleared"
      );

    }, [showToast]);

  // ==========================================
  // CART ITEMS
  // ==========================================

  const cartItems =
    useMemo(() => {

      return cart
        .map((item) => {

          const product =
            allProducts.find(
              (p) =>
                String(p.id) ===
                String(item.id)
            );

          if (!product) {
            return null;
          }

          return {
            ...product,
            qty: item.qty,
          };

        })
        .filter(Boolean);

    }, [cart]);

  // ==========================================
  // WISHLIST ITEMS
  // ==========================================

  const wishlistItems =
    useMemo(() => {

      return allProducts.filter(
        (product) =>
          wishlist.includes(
            product.id
          )
      );

    }, [wishlist]);

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount =
    useMemo(() => {

      return cart.reduce(
        (total, item) =>
          total +
          Number(
            item.qty || 0
          ),
        0
      );

    }, [cart]);

  // ==========================================
  // WISHLIST COUNT
  // ==========================================

  const wishlistCount =
    useMemo(() => {

      return wishlist.length;

    }, [wishlist]);

  // ==========================================
  // CART SUBTOTAL
  // ==========================================

  const cartSubtotal =
    useMemo(() => {

      return cartItems.reduce(
        (total, item) =>
          total +
          Number(
            item.price || 0
          ) *
            Number(
              item.qty || 0
            ),
        0
      );

    }, [cartItems]);

  // ==========================================
  // FILTERED PRODUCTS
  // ==========================================

  const filteredProducts =
    useMemo(() => {

      let list = [
        ...allProducts,
      ];

      // SEARCH

      if (search.trim()) {

        const q =
          search
            .trim()
            .toLowerCase();

        list = list.filter(
          (product) => {

            return (
              String(
                product.name || ""
              )
                .toLowerCase()
                .includes(q) ||

              String(
                product.category ||
                  ""
              )
                .toLowerCase()
                .includes(q) ||

              String(
                product.state ||
                  ""
              )
                .toLowerCase()
                .includes(q) ||

              String(
                product.description ||
                  ""
              )
                .toLowerCase()
                .includes(q)
            );

          }
        );

      }

      // CATEGORY

      if (
        activeCategory !==
        "all"
      ) {

        list =
          list.filter(
            (product) =>
              product.category ===
              activeCategory
          );

      }

      // PRICE

      list =
        list.filter(
          (product) =>
            Number(
              product.price || 0
            ) <=
            Number(
              maxPrice || 10000
            )
        );

      // STATE

      if (
        activeStates.length >
        0
      ) {

        list =
          list.filter(
            (product) =>
              activeStates.includes(
                product.state
              )
          );

      }

      // RATING

      if (minRating > 0) {

        list =
          list.filter(
            (product) =>
              Number(
                product.rating || 0
              ) >= minRating
          );

      }

      // SORT

      switch (sortBy) {

        case "price-asc":

          list.sort(
            (a, b) =>
              Number(
                a.price || 0
              ) -
              Number(
                b.price || 0
              )
          );

          break;

        case "price-desc":

          list.sort(
            (a, b) =>
              Number(
                b.price || 0
              ) -
              Number(
                a.price || 0
              )
          );

          break;

        case "rating":

          list.sort(
            (a, b) =>
              Number(
                b.rating || 0
              ) -
              Number(
                a.rating || 0
              )
          );

          break;

        case "newest":

          list.reverse();

          break;

        case "recommended":
        default:
          break;
      }

      return list;

    }, [
      search,
      activeCategory,
      maxPrice,
      activeStates,
      minRating,
      sortBy,
    ]);

  // ==========================================
  // STATE FILTER
  // ==========================================

  const toggleStateFilter =
    useCallback(
      (state) => {

        setActiveStates(
          (prev) => {

            if (
              prev.includes(
                state
              )
            ) {

              return prev.filter(
                (item) =>
                  item !== state
              );

            }

            return [
              ...prev,
              state,
            ];

          }
        );

      },
      []
    );

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters =
    useCallback(() => {

      setActiveCategory(
        "all"
      );

      setMaxPrice(
        10000
      );

      setActiveStates([]);

      setMinRating(0);

      setSortBy(
        "recommended"
      );

      setSearch("");

    }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout =
    useCallback(() => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "userId"
      );

      localStorage.removeItem(
        "user"
      );

      setToken(null);

      setUserId(null);

      setUser(null);

      setCart([]);

      setWishlist([]);

      setCartOpen(false);

      setCheckoutOpen(false);

    }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {

    // AUTH

    token,
    userId,
    user,
    isLoggedIn,

    login,
    logout,

    // CART

    cart,
    cartItems,
    cartCount,
    cartSubtotal,

    cartOpen,
    setCartOpen,

    addToCart,
    removeFromCart,
    updateQty,
    clearCart,

    // CHECKOUT

    checkoutOpen,
    setCheckoutOpen,

    // WISHLIST

    wishlist,
    wishlistItems,
    wishlistCount,

    wishlistOpen,
    setWishlistOpen,

    toggleWishlist,
    removeFromWishlist,
    clearWishlist,

    // SEARCH

    search,
    setSearch,

    // FILTERS

    activeCategory,
    setActiveCategory,

    maxPrice,
    setMaxPrice,

    activeStates,
    toggleStateFilter,

    minRating,
    setMinRating,

    sortBy,
    setSortBy,

    clearFilters,

    filteredProducts,

    filterDrawerOpen,
    setFilterDrawerOpen,

    // TOAST

    toasts,
    showToast,
    dismissToast,
  };

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// useApp HOOK
// ==========================================

export function useApp() {

  const context =
    useContext(
      AppContext
    );

  if (!context) {

    throw new Error(
      "useApp must be used inside AppProvider"
    );

  }

  return context;
}