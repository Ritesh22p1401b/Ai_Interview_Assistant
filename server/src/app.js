import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";

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

app.use(
  session({
    name: "ai-resume.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only in HTTPS
    },
  })
);

/* ------------------ PASSPORT ------------------ */
configurePassport(); // 🔥 SAFE: env already loaded

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
