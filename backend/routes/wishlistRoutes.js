import express from "express";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

// GET wishlist
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.params.userId,
    }).populate("products");

    res.json(wishlist || { user: req.params.userId, products: [] });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
});

// ADD product to wishlist
router.post("/:userId", async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({
      user: req.params.userId,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.params.userId,
        products: [],
      });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(
      wishlist._id
    ).populate("products");

    res.json(updatedWishlist);
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({
      message: "Failed to add to wishlist",
    });
  }
});

// REMOVE product from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.params.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(
      wishlist._id
    ).populate("products");

    res.json(updatedWishlist);
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({
      message: "Failed to remove from wishlist",
    });
  }
});

export default router;