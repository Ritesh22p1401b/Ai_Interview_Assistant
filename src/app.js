// server/src/app.js

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import { RedisStore } from "connect-redis";

import { connection as redisClient } from "./config/redis.js";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

/* ------------------ SECURITY ------------------ */
app.use(helmet());

/* ------------------ BODY PARSER ------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ CORS ------------------ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ------------------ REDIS SESSION STORE ------------------ */
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

app.use(
  session({
    store: redisStore,
    name: "ai-resume.sid",
    secret: process.env.SESSION_SECRET || "dev-fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/* ------------------ PASSPORT ------------------ */
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

/* ------------------ ROUTES ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

/* ------------------ HEALTH CHECK ------------------ */
app.get("/api/health", (req, res) => {
  res.json({ status: "Server working 🚀" });
});

/* ------------------ GLOBAL ERROR HANDLER ------------------ */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();