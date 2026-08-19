import express from "express";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controller/cartController.js";

const router = express.Router();

// ==========================================
// GET CART
// GET /api/cart/:userId
// ==========================================
router.get("/:userId", getCart);

// ==========================================
// ADD TO CART
// POST /api/cart/:userId
// ==========================================
router.post("/:userId", addToCart);

// ==========================================
// UPDATE QUANTITY
// PUT /api/cart/:userId/:productId
// ==========================================
router.put("/:userId/:productId", updateCartQuantity);

// ==========================================
// REMOVE ONE PRODUCT
// DELETE /api/cart/:userId/:productId
// ==========================================
router.delete("/:userId/:productId", removeFromCart);

// ==========================================
// CLEAR ENTIRE CART
// DELETE /api/cart/:userId/clear
// ==========================================
router.delete("/:userId/clear", clearCart);

export default router;