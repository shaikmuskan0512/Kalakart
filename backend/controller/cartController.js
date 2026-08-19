import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/Product.js";

// ======================================================
// HELPER — FIND PRODUCT
// Accepts:
// 1. Numeric productId from frontend
// 2. MongoDB _id
// ======================================================

const findProduct = async (productId) => {
  if (
    productId === undefined ||
    productId === null ||
    productId === ""
  ) {
    return null;
  }

  const value = String(productId).trim();

  // First try your numeric productId
  if (/^\d+$/.test(value)) {
    const product = await Product.findOne({
      productId: Number(value),
    });

    if (product) {
      return product;
    }
  }

  // Then try MongoDB _id
  if (mongoose.Types.ObjectId.isValid(value)) {
    return await Product.findById(value);
  }

  return null;
};

// ======================================================
// GET CART
// GET /api/cart/:userId
// ======================================================

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        user: userId,
        items: [],
      });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// ======================================================
// ADD TO CART
// POST /api/cart/:userId
// ======================================================

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      productId,
      quantity = 1,
    } = req.body;

    console.log("=================================");
    console.log("ADD TO CART");
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("quantity:", quantity);
    console.log("=================================");

    // --------------------------------------------------
    // USER ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // --------------------------------------------------
    // PRODUCT
    // --------------------------------------------------

    const product = await findProduct(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // QUANTITY
    // --------------------------------------------------

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // --------------------------------------------------
    // FIND CART
    // --------------------------------------------------

    let cart = await Cart.findOne({
      user: userId,
    });

    // --------------------------------------------------
    // CREATE CART
    // --------------------------------------------------

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: qty,
          },
        ],
      });
    } else {
      // ------------------------------------------------
      // FIND EXISTING ITEM
      // ------------------------------------------------

      const existingItem = cart.items.find(
        (item) =>
          String(item.product) ===
          String(product._id)
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({
          product: product._id,
          quantity: qty,
        });
      }
    }

    await cart.save();

    // --------------------------------------------------
    // RETURN UPDATED CART
    // --------------------------------------------------

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to add to cart",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE QUANTITY
// PUT /api/cart/:userId/:productId
// ======================================================

export const updateCartQuantity = async (
  req,
  res
) => {
  try {
    const {
      userId,
      productId,
    } = req.params;

    const { quantity } = req.body;

    console.log("=================================");
    console.log("UPDATE CART");
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("quantity:", quantity);
    console.log("=================================");

    // --------------------------------------------------
    // USER ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // --------------------------------------------------
    // PRODUCT
    // --------------------------------------------------

    const product = await findProduct(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // QUANTITY
    // --------------------------------------------------

    const newQuantity = Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {
      return res.status(400).json({
        message:
          "Quantity must be at least 1",
      });
    }

    // --------------------------------------------------
    // CART
    // --------------------------------------------------

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // --------------------------------------------------
    // FIND ITEM
    // --------------------------------------------------

    const item = cart.items.find(
      (cartItem) =>
        String(cartItem.product) ===
        String(product._id)
    );

    if (!item) {
      return res.status(404).json({
        message:
          "Product not found in cart",
      });
    }

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    item.quantity = newQuantity;

    await cart.save();

    // --------------------------------------------------
    // RETURN UPDATED CART
    // --------------------------------------------------

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update quantity",
      error: error.message,
    });
  }
};

// ======================================================
// REMOVE ITEM
// DELETE /api/cart/:userId/:productId
// ======================================================

export const removeFromCart = async (
  req,
  res
) => {
  try {
    const {
      userId,
      productId,
    } = req.params;

    console.log("=================================");
    console.log("REMOVE CART ITEM");
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("=================================");

    // --------------------------------------------------
    // USER ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // --------------------------------------------------
    // PRODUCT
    // --------------------------------------------------

    const product = await findProduct(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // CART
    // --------------------------------------------------

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // --------------------------------------------------
    // REMOVE ITEM
    // --------------------------------------------------

    const oldLength =
      cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        String(item.product) !==
        String(product._id)
    );

    if (
      cart.items.length === oldLength
    ) {
      return res.status(404).json({
        message:
          "Product not found in cart",
      });
    }

    await cart.save();

    // --------------------------------------------------
    // RETURN UPDATED CART
    // --------------------------------------------------

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(
      "REMOVE CART ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to remove from cart",
      error: error.message,
    });
  }
};

// ======================================================
// CLEAR CART
// DELETE /api/cart/:userId
// ======================================================

export const clearCart = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    console.log(
      "CLEAR CART:",
      userId
    );

    // --------------------------------------------------
    // USER ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // --------------------------------------------------
    // CART
    // --------------------------------------------------

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(200).json({
        user: userId,
        items: [],
      });
    }

    // --------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      user: userId,
      items: [],
    });
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to clear cart",
      error: error.message,
    });
  }
};