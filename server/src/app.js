// app.js
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import RedisStore from "connect-redis";

import { redisClient } from "./config/redis.js"; // ✅ IMPORT REDIS
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";

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
    store: redisStore, // ✅ Redis-backed sessions
    name: "ai-resume.sid",
    secret: process.env.SESSION_SECRET || "dev-fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
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
