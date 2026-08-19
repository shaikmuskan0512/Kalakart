import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================= WISHLIST =================

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ================= CART =================

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },

  // ================= OPTIONS =================

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;