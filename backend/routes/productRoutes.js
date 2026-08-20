import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {
  try {
    console.log("================================");
    console.log("GET /api/products");
    console.log("Fetching products from MongoDB...");
    console.log("================================");

    const products = await Product.find({}).lean();

    console.log(
      "Products found:",
      products.length
    );

    res.status(200).json(products);
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      $or: [
        {
          productId: Number(id),
        },
        {
          _id: id,
        },
      ],
    }).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(
      "GET SINGLE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

export default router;