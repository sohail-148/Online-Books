const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders — place an order (auth required)
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }
    if (!shippingAddress || !totalPrice) {
      return res
        .status(400)
        .json({ error: "Shipping address and total price are required" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not place order" });
  }
});

// GET /api/orders/myorders — get current user's orders (auth required)
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not fetch orders" });
  }
});

// GET /api/orders/:id — get a single order (auth required, owner only)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not fetch order" });
  }
});

module.exports = router;
