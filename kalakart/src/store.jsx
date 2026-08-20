import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const AppContext = createContext(null);

// ==========================================
// BACKEND URL
// ==========================================

const API_URL = "https://kalakart-y527.onrender.com";

// ==========================================
// APP PROVIDER
// ==========================================

export function AppProvider({ children }) {
  // ==========================================
  // PRODUCTS
  // ==========================================

  const [allProducts, setAllProducts] = useState([]);

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
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

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
    (loginToken, loginUser = null, loginUserId = null) => {
      localStorage.setItem("token", loginToken);
      setToken(loginToken);

      if (loginUserId) {
        localStorage.setItem("userId", loginUserId);
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
  // CART STATE
  // ==========================================

  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // ==========================================
  // WISHLIST
  // ==========================================

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist =
        localStorage.getItem("wishlist");

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

  const [search, setSearch] = useState("");

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

  const [toasts, setToasts] = useState([]);

  const toastId = useRef(0);

  const showToast = useCallback((message) => {
    const id = ++toastId.current;

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
          (toast) => toast.id !== id
        )
      );
    }, 2800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  }, []);

  // ==========================================
  // RESPONSE HELPER
  // ==========================================

  const getResponseData = async (response) => {
    const contentType =
      response.headers.get("content-type") || "";

    if (
      contentType.includes("application/json")
    ) {
      return await response.json();
    }

    const text = await response.text();

    return {
      message:
        text ||
        `Server returned ${response.status}`,
    };
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log(
          "================================"
        );

        console.log(
          "LOADING PRODUCTS FROM RENDER"
        );

        console.log(
          "PRODUCT API:",
          `${API_URL}/api/products`
        );

        console.log(
          "================================"
        );

        const response = await fetch(
          `${API_URL}/api/products`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log(
          "PRODUCT STATUS:",
          response.status
        );

        const data =
          await getResponseData(response);

        console.log(
          "PRODUCT RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to fetch products (${response.status})`
          );
        }

        let productsData = [];

        if (Array.isArray(data)) {
          productsData = data;
        } else if (
          Array.isArray(data.products)
        ) {
          productsData = data.products;
        } else if (
          Array.isArray(data.data)
        ) {
          productsData = data.data;
        }

        const normalizedProducts =
          productsData.map((product) => ({
            ...product,

            id:
              product.productId ??
              product.id ??
              product._id,

            productId:
              product.productId ??
              product.id ??
              product._id,

            name:
              product.name ||
              "Unnamed Product",

            description:
              product.description || "",

            price:
              Number(product.price || 0),

            originalPrice:
              Number(
                product.originalPrice ??
                  product.price ??
                  0
              ),

            category:
              product.category || "",

            state:
              product.state || "",

            rating:
              Number(product.rating || 0),

            image:
              product.image || "",

            stock:
              Number(product.stock || 0),
          }));

        console.log(
          "FINAL PRODUCT COUNT:",
          normalizedProducts.length
        );

        setAllProducts(
          normalizedProducts
        );
      } catch (error) {
        console.error(
          "PRODUCT LOAD ERROR:",
          error
        );

        setAllProducts([]);
      }
    };

    loadProducts();
  }, []);

  // ==========================================
  // FORMAT CART
  // ==========================================

  const formatCart = useCallback(
    (items = []) => {
      return items
        .map((item) => {
          const product = item.product;

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
  // LOAD CART
  // ==========================================

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setCart([]);
        return;
      }

      try {
        console.log(
          "Loading cart for user:",
          userId
        );

        const response = await fetch(
          `${API_URL}/api/cart/${userId}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",

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
          await getResponseData(response);

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
  // ADD TO CART
  // ==========================================

  const addToCart = useCallback(
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
        const productId =
          product.productId ??
          product.id ??
          product._id;

        if (!productId) {
          throw new Error(
            "Invalid product ID"
          );
        }

        console.log(
          "ADDING PRODUCT:",
          productId
        );

        const response =
          await fetch(
            `${API_URL}/api/cart/${userId}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",

                ...(token
                  ? {
                      Authorization:
                        `Bearer ${token}`,
                    }
                  : {}),
              },

              body: JSON.stringify({
                productId,
                quantity: 1,
              }),
            }
          );

        const data =
          await getResponseData(response);

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
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart =
    useCallback(
      async (id) => {
        if (!userId) return;

        if (
          id === undefined ||
          id === null
        ) {
          showToast(
            "Invalid product"
          );

          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}/${id}`,
              {
                method: "DELETE",

                headers: {
                  Accept:
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
            await getResponseData(response);

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
  // CLEAR CART
  // ==========================================

  const clearCart =
    useCallback(
      async () => {
        if (!userId) {
          setCart([]);
          return true;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/api/cart/${userId}/clear`,
              {
                method: "DELETE",

                headers: {
                  Accept:
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
            await getResponseData(response);

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
  // UPDATE QUANTITY
  // ==========================================

  const updateQty =
    useCallback(
      async (id, delta) => {
        if (!userId) return;

        if (
          id === undefined ||
          id === null
        ) {
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
            Number(currentItem.qty) +
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

                  Accept:
                    "application/json",

                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },

                body: JSON.stringify({
                  quantity: newQty,
                }),
              }
            );

          const data =
            await getResponseData(response);

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
  // PLACE ORDER
  // ==========================================

  const placeOrder = useCallback(
    async (orderData) => {
      if (!userId) {
        throw new Error(
          "Please login before placing an order"
        );
      }

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please login again."
        );
      }

      if (!cartItems.length) {
        throw new Error(
          "Your cart is empty"
        );
      }

      try {
        console.log(
          "================================"
        );

        console.log(
          "PLACING ORDER"
        );

        console.log(
          "ORDER API:",
          `${API_URL}/api/orders/${userId}`
        );

        console.log(
          "ORDER DATA:",
          orderData
        );

        console.log(
          "================================"
        );

        const items = cartItems.map(
          (item) => ({
            product:
              item._id ||
              item.productId ||
              item.id,

            quantity:
              Number(item.qty || 1),

            price:
              Number(item.price || 0),
          })
        );

        const totalAmount =
          items.reduce(
            (total, item) =>
              total +
              item.price *
                item.quantity,
            0
          );

        const payload = {
          items,
          totalAmount,

          shippingAddress:
            orderData.shippingAddress ||
            orderData.address,

          paymentMethod:
            orderData.paymentMethod ||
            "COD",
        };

        console.log(
          "FINAL ORDER PAYLOAD:",
          payload
        );

        const response =
          await fetch(
            `${API_URL}/api/orders/${userId}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                payload
              ),
            }
          );

        console.log(
          "ORDER RESPONSE STATUS:",
          response.status
        );

        const data =
          await getResponseData(response);

        console.log(
          "ORDER RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Order failed (${response.status})`
          );
        }

        // Clear frontend cart
        setCart([]);

        setCheckoutOpen(false);

        setCartOpen(false);

        showToast(
          "✓ Order placed successfully"
        );

        return data;
      } catch (error) {
        console.error(
          "PLACE ORDER ERROR:",
          error
        );

        throw error;
      }
    },
    [
      userId,
      token,
      cartItems,
      showToast,
    ]
  );

  // ==========================================
  // WISHLIST TOGGLE
  // ==========================================

  const toggleWishlist =
    useCallback(
      (product) => {
        if (!product) return;

        const productId =
          product.productId ??
          product.id ??
          product._id;

        setWishlist((prev) => {
          const exists =
            prev.some(
              (id) =>
                String(id) ===
                String(productId)
            );

          let updatedWishlist;

          if (exists) {
            updatedWishlist =
              prev.filter(
                (id) =>
                  String(id) !==
                  String(productId)
              );

            showToast(
              "♡ Removed from wishlist"
            );
          } else {
            updatedWishlist = [
              ...prev,
              productId,
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
  // REMOVE WISHLIST
  // ==========================================

  const removeFromWishlist =
    useCallback(
      (id) => {
        setWishlist((prev) => {
          const updatedWishlist =
            prev.filter(
              (productId) =>
                String(productId) !==
                String(id)
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
  // CLEAR WISHLIST
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

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product =
          allProducts.find(
            (p) =>
              String(
                p.productId ??
                  p.id ??
                  p._id
              ) ===
              String(item.id)
          );

        if (!product) return null;

        return {
          ...product,
          qty: item.qty,
        };
      })
      .filter(Boolean);
  }, [
    cart,
    allProducts,
  ]);

  // ==========================================
  // WISHLIST ITEMS
  // ==========================================

  const wishlistItems =
    useMemo(() => {
      return allProducts.filter(
        (product) =>
          wishlist.some(
            (id) =>
              String(id) ===
              String(
                product.productId ??
                  product.id ??
                  product._id
              )
          )
      );
    }, [
      wishlist,
      allProducts,
    ]);

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.qty || 0),
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
          Number(item.price || 0) *
            Number(item.qty || 0),
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
          (product) =>
            String(
              product.name || ""
            )
              .toLowerCase()
              .includes(q) ||
            String(
              product.category || ""
            )
              .toLowerCase()
              .includes(q) ||
            String(
              product.state || ""
            )
              .toLowerCase()
              .includes(q) ||
            String(
              product.description || ""
            )
              .toLowerCase()
              .includes(q)
        );
      }

      // CATEGORY

      if (
        activeCategory !== "all"
      ) {
        list =
          list.filter(
            (product) =>
              String(
                product.category || ""
              ).toLowerCase() ===
              String(
                activeCategory
              ).toLowerCase()
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

      // STATES

      if (
        activeStates.length > 0
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
              Number(a.price || 0) -
              Number(b.price || 0)
          );
          break;

        case "price-desc":
          list.sort(
            (a, b) =>
              Number(b.price || 0) -
              Number(a.price || 0)
          );
          break;

        case "rating":
          list.sort(
            (a, b) =>
              Number(b.rating || 0) -
              Number(a.rating || 0)
          );
          break;

        case "newest":
          list.reverse();
          break;

        default:
          break;
      }

      return list;
    }, [
      allProducts,
      search,
      activeCategory,
      maxPrice,
      activeStates,
      minRating,
      sortBy,
    ]);

  // ==========================================
  // FILTER FUNCTIONS
  // ==========================================

  const toggleStateFilter =
    useCallback(
      (state) => {
        setActiveStates(
          (prev) => {
            if (
              prev.includes(state)
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

  const clearFilters =
    useCallback(() => {
      setActiveCategory("all");
      setMaxPrice(10000);
      setActiveStates([]);
      setMinRating(0);
      setSortBy("recommended");
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
    // API
    API_URL,

    // PRODUCTS
    allProducts,
    filteredProducts,

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
    placeOrder,

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
// useApp
// ==========================================

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}