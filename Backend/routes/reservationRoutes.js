const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// ===============================
// CREATE RESERVATION
// ===============================

router.post("/reserve", async (req, res) => {
  console.log("========== RESERVATION REQUEST ==========");
  console.log(req.body);

  try {
    // ===============================
    // SAVE RESERVATION
    // ===============================

    const reservation = new Reservation(req.body);

    console.log("Saving reservation to MongoDB...");

    await reservation.save();

    console.log("Reservation saved successfully!");
    console.log("Reservation ID:", reservation._id);

    // ===============================
    // RESPOND TO CUSTOMER
    // ===============================

    res.status(201).json({
      message: "Reservation saved successfully!",
      reservation,
    });

  } catch (err) {
    console.error("========== RESERVATION ERROR ==========");
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to save reservation.",
      });
    }
  }
});

module.exports = router;