import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();


// ==================== REGISTER ====================

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== LOGIN ====================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== PROFILE ====================

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You are authenticated!",
      userId: req.user.userId,
    });
  }
);

// ==================== EXPORT ====================

export default router;