import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

// 🔥 passport config imported AFTER dotenv ran in server.js
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

export default app;
