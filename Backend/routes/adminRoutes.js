const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../middleware/authMiddleware");

// ==========================================
// ADMIN LOGIN
// ==========================================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      role: "admin",
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================



// ==========================================
// GET ALL RESERVATIONS
// ==========================================

router.get(
  "/reservations",
  verifyAdmin,
  async (req, res) => {
    try {
      const reservations =
        await Reservation.find().sort({
          createdAt: -1,
        });

      res.json(reservations);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch reservations",
      });
    }
  }
);

// ==========================================
// UPDATE RESERVATION STATUS
// ==========================================

router.patch(
  "/reservations/:id/status",
  verifyAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const reservation =
        await Reservation.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      if (!reservation) {
        return res.status(404).json({
          message: "Reservation not found",
        });
      }

      res.json(reservation);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update reservation status",
      });
    }
  }
);

// ==========================================
// DELETE RESERVATION
// ==========================================

router.delete(
  "/reservations/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const reservation =
        await Reservation.findByIdAndDelete(
          req.params.id
        );

      if (!reservation) {
        return res.status(404).json({
          message: "Reservation not found",
        });
      }

      res.json({
        message:
          "Reservation deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete reservation",
      });
    }
  }
);

module.exports = router;