const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE ORDER
router.post("/orders", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      instructions,
      items,
      totalAmount,
    } = req.body;

    const order = new Order({
      customerName,
      phone,
      address,
      instructions,
      items,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);

    res.status(500).json({
      message: "Failed to place order.",
    });
  }
});


// GET ALL ORDERS
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
});


// UPDATE ORDER STATUS
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json(updatedOrder);

  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update order status.",
    });
  }
});


module.exports = router;