import express from "express";
import passport from "passport";

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true
  }),
  (req, res) => {
    // Temporary success response
    res.send("Google OAuth success");
  }
);

export default router;
