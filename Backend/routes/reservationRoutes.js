const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const nodemailer = require("nodemailer");

// ===============================
// EMAIL SETUP
// ===============================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Check email connection when server starts
transporter.verify((error) => {
  if (error) {
    console.error("========== EMAIL CONFIGURATION FAILED ==========");
    console.error(error.message);
  } else {
    console.log("========== EMAIL CONFIGURATION SUCCESS ==========");
    console.log("Gmail is ready to send emails.");
  }
});

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
    // SEND SUCCESS RESPONSE FIRST
    // ===============================

    res.status(201).json({
      message: "Reservation saved successfully!",
      reservation,
    });

    // ===============================
    // EMAIL
    // ===============================
    // Email is sent AFTER the customer
    // already receives the success response.

    const mailOptions = {
      from: `"Local Restro Cafe" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Your Table is Reserved at Local Restro Cafe ✨",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          background: #f8f6f1;
          color: #222;
        ">

          <div style="
            background: #111;
            padding: 30px;
            text-align: center;
          ">
            <h1 style="
              color: #d4af37;
              margin: 0;
              letter-spacing: 2px;
            ">
              LOCAL RESTRO CAFE
            </h1>

            <p style="color: white;">
              Palasuni, Bhubaneswar
            </p>
          </div>

          <div style="padding: 30px;">

            <h2>Your Table is Reserved ✨</h2>

            <p>
              Hi <strong>${reservation.name}</strong>,
            </p>

            <p>
              Thank you for choosing
              <strong>Local Restro Cafe</strong>.
              We're delighted to confirm your table reservation.
            </p>

            <div style="
              background: white;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #d4af37;
            ">

              <h3>Reservation Details</h3>

              <p>
                📅 <strong>Date:</strong>
                ${reservation.date}
              </p>

              <p>
                🕐 <strong>Time:</strong>
                ${reservation.time}
              </p>

              <p>
                👥 <strong>Guests:</strong>
                ${reservation.guests}
              </p>

              <p>
                👤 <strong>Name:</strong>
                ${reservation.name}
              </p>

            </div>

            <p>
              Your table has been reserved for the date and time
              mentioned above.
            </p>

            <p>
              We look forward to welcoming you and making your
              visit a memorable one. ✨
            </p>

            <p>
              If you need to make any changes to your reservation,
              please contact us before your scheduled time.
            </p>

            <p style="
              margin-top: 30px;
              font-weight: bold;
            ">
              See you soon at Local Restro Cafe!
            </p>

            <p style="
              color: #777;
              font-style: italic;
            ">
              Good food. Good moments. Great memories.
            </p>

          </div>

          <div style="
            background: #111;
            padding: 20px;
            text-align: center;
            color: white;
            font-size: 13px;
          ">
            Local Restro Cafe<br />
            Palasuni, Bhubaneswar
          </div>

        </div>
      `,
    };

    try {
      console.log("========== TRYING EMAIL ==========");
      console.log("Sending to:", reservation.email);

      const info = await transporter.sendMail(mailOptions);

      console.log("========== EMAIL SENT ==========");
      console.log("Message ID:", info.messageId);

    } catch (emailError) {
      console.error("========== EMAIL FAILED ==========");
      console.error("Error message:", emailError.message);
    }

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