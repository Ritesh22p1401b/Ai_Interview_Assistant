import dotenv from "dotenv";
dotenv.config(); // 🔥 FIRST LINE AFTER IMPORTS

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  console.log("✅ MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
