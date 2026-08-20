import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";
import Cart from "../models/Cart.js";


// =====================================================
// CREATE ORDER
// POST /api/orders/:userId
// =====================================================

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
    } = req.body;

    console.log("=================================");
    console.log("CREATE ORDER");
    console.log("User ID:", userId);
    console.log("Payment:", paymentMethod);
    console.log("=================================");

    // =================================================
    // VALIDATE USER ID
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // =================================================
    // VALIDATE ADDRESS
    // =================================================

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    // =================================================
    // VALIDATE PAYMENT METHOD
    // =================================================

    if (
      !paymentMethod ||
      !["UPI", "Cash on Delivery"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        message: "Please select a valid payment method",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =================================================
    // GET CART FROM MONGODB
    // =================================================

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    console.log(
      "Cart items:",
      cart.items.length
    );

    // =================================================
    // PREPARE ORDER ITEMS
    // =================================================

    const orderItems = [];

    for (const cartItem of cart.items) {
      if (!cartItem.product) {
        continue;
      }

      const quantity = Number(
        cartItem.quantity
      );

      const price = Number(
        cartItem.product.price
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        continue;
      }

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        continue;
      }

      orderItems.push({
        product: cartItem.product._id,
        quantity,
        price,
      });
    }

    // =================================================
    // CHECK VALID ITEMS
    // =================================================

    if (orderItems.length === 0) {
      return res.status(400).json({
        message: "No valid products found in cart",
      });
    }

    // =================================================
    // CALCULATE TOTAL
    // =================================================

    const calculatedTotal = orderItems.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

    // =================================================
    // CREATE ORDER
    // =================================================

    const newOrder = await Order.create({
      user: userId,

      items: orderItems,

      totalAmount: calculatedTotal,

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      },

      paymentMethod,

      status: "Placed",
    });

    // =================================================
    // CLEAR MONGODB CART
    // =================================================

    cart.items = [];

    await cart.save();

    // =================================================
    // CLEAR USER EMBEDDED CART IF IT EXISTS
    // =================================================

    if (Array.isArray(user.cart)) {
      user.cart = [];
      await user.save();
    }

    // =================================================
    // POPULATE ORDER BEFORE RETURNING
    // =================================================

    const populatedOrder =
      await Order.findById(
        newOrder._id
      ).populate(
        "items.product",
        "productId name image price"
      );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// =====================================================
// GET USER ORDERS
// GET /api/orders/user/:userId
// =====================================================

export const getUserOrders = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    // =================================================
    // VALIDATE USER ID
    // =================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // =================================================
    // CHECK USER
    // =================================================

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =================================================
    // GET ORDERS
    // =================================================

    const orders = await Order.find({
      user: userId,
    })
      .sort({
        createdAt: -1,
      })
      .populate(
        "items.product",
        "productId name image price"
      );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error(
      "GET USER ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE ORDER
// GET /api/orders/single/:orderId
// =====================================================

export const getOrderById = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    // =================================================
    // VALIDATE ORDER ID
    // =================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        orderId
      )
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // =================================================
    // FIND ORDER
    // =================================================

    const order =
      await Order.findById(
        orderId
      )
        .populate(
          "user",
          "firstName lastName email"
        )
        .populate(
          "items.product",
          "productId name image price"
        );

    // =================================================
    // ORDER NOT FOUND
    // =================================================

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};