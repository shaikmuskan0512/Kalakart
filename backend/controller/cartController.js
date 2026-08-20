import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ==========================================
// GET CART
// ==========================================

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    let cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });

      cart = await Cart.findById(cart._id).populate(
        "items.product"
      );
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// ==========================================
// ADD TO CART
// ==========================================

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    console.log("================================");
    console.log("ADD TO CART");
    console.log("User:", userId);
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);
    console.log("================================");

    // Validate user
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Validate product ID
    if (
      productId === undefined ||
      productId === null
    ) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // ==========================================
    // FIND PRODUCT USING productId
    // ==========================================

    const product = await Product.findOne({
      productId: Number(productId),
    });

    if (!product) {
      console.log(
        "Product not found:",
        productId
      );

      return res.status(404).json({
        message: `Product ${productId} not found`,
      });
    }

    console.log(
      "Product found:",
      product.name,
      product._id
    );

    // ==========================================
    // FIND USER CART
    // ==========================================

    let cart = await Cart.findOne({
      user: userId,
    });

    // ==========================================
    // CREATE CART IF NOT EXISTS
    // ==========================================

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: Number(quantity),
          },
        ],
      });

      await cart.save();

      cart = await Cart.findById(
        cart._id
      ).populate("items.product");

      return res.status(201).json(cart);
    }

    // ==========================================
    // CHECK IF PRODUCT ALREADY EXISTS
    // ==========================================

    const existingItem =
      cart.items.find(
        (item) =>
          String(item.product) ===
          String(product._id)
      );

    if (existingItem) {
      existingItem.quantity +=
        Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    // ==========================================
    // RETURN POPULATED CART
    // ==========================================

    cart = await Cart.findById(
      cart._id
    ).populate("items.product");

    res.status(200).json(cart);
  } catch (error) {
    console.error(
      "ADD TO CART ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE QUANTITY
// ==========================================

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

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (
      productId === undefined ||
      productId === null
    ) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const newQuantity =
      Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {
      return res.status(400).json({
        message:
          "Quantity must be at least 1",
      });
    }

    const product =
      await Product.findOne({
        productId: Number(productId),
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item =
      cart.items.find(
        (item) =>
          String(item.product) ===
          String(product._id)
      );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    item.quantity = newQuantity;

    await cart.save();

    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate("items.product");

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update cart quantity",
      error: error.message,
    });
  }
};

// ==========================================
// REMOVE FROM CART
// ==========================================

export const removeFromCart = async (
  req,
  res
) => {
  try {
    const {
      userId,
      productId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const product =
      await Product.findOne({
        productId: Number(productId),
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items =
      cart.items.filter(
        (item) =>
          String(item.product) !==
          String(product._id)
      );

    await cart.save();

    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate("items.product");

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(
      "REMOVE CART ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to remove product from cart",
      error: error.message,
    });
  }
};

// ==========================================
// CLEAR CART
// ==========================================

export const clearCart = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
        items: [],
      });
    }

    cart.items = [];

    await cart.save();

    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate("items.product");

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};