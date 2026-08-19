import express from "express";

import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../controller/orderController.js";

const router = express.Router();

// ==========================================
// CREATE ORDER
// POST /api/orders/:userId
// ==========================================

router.post("/:userId", createOrder);

// ==========================================
// GET ALL ORDERS OF USER
// GET /api/orders/user/:userId
// IMPORTANT: keep this BEFORE /:orderId
// ==========================================

router.get("/user/:userId", getUserOrders);

// ==========================================
// GET SINGLE ORDER
// GET /api/orders/single/:orderId
// ==========================================

router.get("/single/:orderId", getOrderById);

export default router;