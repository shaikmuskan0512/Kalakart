import Product from "../models/Product.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: 1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};