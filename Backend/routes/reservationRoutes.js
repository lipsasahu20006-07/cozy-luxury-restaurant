const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const nodemailer = require("nodemailer");

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// CREATE RESERVATION
router.post("/reserve", async (req, res) => {
  console.log("========== REQUEST RECEIVED ==========");
  console.log(req.body);

  try {
    // Save reservation
    const reservation = new Reservation(req.body);

    console.log("Saving to MongoDB...");

    await reservation.save();

    console.log("Saved!");

    // Send confirmation email
    const mailOptions = {
      from: `"Local Restro Cafe" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Your Table is Reserved at Local Restro Cafe ✨",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #f8f6f1;
          color: #222;
        ">

          <div style="
            background: #111;
            padding: 25px;
            text-align: center;
          ">
            <h1 style="
              color: #d4af37;
              margin: 0;
              letter-spacing: 2px;
            ">
              LOCAL RESTRO CAFE
            </h1>

            <p style="
              color: #ffffff;
              margin-bottom: 0;
            ">
              Palasuni, Bhubaneswar
            </p>
          </div>

          <div style="padding: 25px 10px;">

            <h2 style="color: #222;">
              Your Table is Reserved ✨
            </h2>

            <p>
              Hi <strong>${reservation.name}</strong>,
            </p>

            <p>
              Thank you for choosing
              <strong>Local Restro Cafe</strong>.
              We're delighted to confirm that your table has
              been successfully reserved.
            </p>

            <div style="
              background: #ffffff;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #d4af37;
            ">

              <h3 style="margin-top: 0;">
                Reservation Details
              </h3>

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
              Your table will be reserved for the date and time
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
            padding: 18px;
            text-align: center;
            color: #ffffff;
            font-size: 13px;
          ">
            Local Restro Cafe<br />
            Palasuni, Bhubaneswar
          </div>

        </div>
      `,
    };

    console.log("Trying to send confirmation email...");
console.log("Sending to:", reservation.email);

try {
  await transporter.sendMail(mailOptions);
  console.log("Confirmation email sent successfully!");
} catch (emailError) {
  console.error("Email sending failed:");
  console.error(emailError);

      console.error("Email sending failed:", emailError);
    }

    res.status(201).json({
      message: "Reservation saved successfully!",
      reservation,
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