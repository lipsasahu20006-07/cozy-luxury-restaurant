const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ SUCCESS! Connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ FAILED");
    console.error(err);
    process.exit(1);
  }
}

test();