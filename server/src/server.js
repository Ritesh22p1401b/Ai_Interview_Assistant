import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 FORCE absolute .env path
dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

// 🔥 PROOF (must print value)
console.log("🔥 SERVER ENV CHECK:", process.env.GOOGLE_CLIENT_ID);

// Start app
import "./app.js";
