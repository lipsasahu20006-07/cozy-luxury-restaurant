const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ===============================
// REQUEST LOGGER
// ===============================

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// ===============================
// ROUTES
// ===============================

app.use("/api", reservationRoutes);
app.use("/api", orderRoutes);
app.use("/api", menuRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// START SERVER
// ===============================

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
    console.log(
      "Mongoose state:",
      mongoose.connection.readyState
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(
      "❌ MongoDB Connection Error:",
      err
    );
  }
}

startServer();