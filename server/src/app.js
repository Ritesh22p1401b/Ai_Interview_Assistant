// app.js
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import { RedisStore } from "connect-redis";

import { redisClient } from "./config/redis.js";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

/* ------------------ MIDDLEWARE ------------------ */
app.use(helmet());
app.use(express.json());

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
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/* ------------------ PASSPORT ------------------ */
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

/* ------------------ ROUTES ------------------ */

// Auth
app.use("/api/auth", authRoutes);

// Resume upload + Gemini question generation
app.use("/api/resume", resumeRoutes);

// Interview related routes
app.use("/api/interview", interviewRoutes);

/* ------------------ HEALTH CHECK ------------------ */
app.get("/api/health", (req, res) => {
  res.json({ status: "Server working 🚀" });
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  console.log("✅ MongoDB connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();