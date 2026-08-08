const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

router.post("/reserve", async (req, res) => {
  console.log("========== REQUEST RECEIVED ==========");
  console.log(req.body);

  try {
    const reservation = new Reservation(req.body);

    console.log("Saving to MongoDB...");

    await reservation.save();

    console.log("Saved!");

    res.status(201).json({
      message: "Reservation saved successfully!",
    });
  } catch (err) {
    console.error("ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;