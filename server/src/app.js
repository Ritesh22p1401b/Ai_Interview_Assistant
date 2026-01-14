import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

// 🔥 Passport config AFTER dotenv is guaranteed loaded
import "./config/passport.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  console.log("✅ MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
