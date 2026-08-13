const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// GET all reservations
router.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({
      createdAt: -1,
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reservations",
    });
  }
});

// UPDATE reservation status
router.patch("/reservations/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
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
      message: "Failed to update reservation status",
    });
  }
});

// DELETE reservation
router.delete("/reservations/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);

    res.json({
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete reservation",
    });
  }
});

module.exports = router;