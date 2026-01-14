import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE ABSOLUTELY FIRST

// 🔥 This import starts the app AFTER env is loaded
import "./app.js";
