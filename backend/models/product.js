import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
     productId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;