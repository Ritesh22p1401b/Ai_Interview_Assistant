import express from "express";
import passport from "passport";

const router = express.Router();

/**
 * ================================
 *  START GOOGLE OAUTH
 *  GET /api/auth/google
 * ================================
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * ================================
 *  GOOGLE OAUTH CALLBACK
 *  GET /api/auth/google/callback
 * ================================
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    session: true,
  }),
  (req, res) => {
    // ✅ Successful authentication
    // User is now available as req.user
    res.redirect("http://localhost:5173/dashboard");
  }
);

/**
 * ================================
 *  AUTH FAILURE
 *  GET /api/auth/failure
 * ================================
 */
router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

/**
 * ================================
 *  GET CURRENT LOGGED-IN USER
 *  GET /api/auth/me
 * ================================
 */
router.get("/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      authenticated: false,
      user: null,
    });
  }

  res.json({
    authenticated: true,
    user: req.user,
  });
});

/**
 * ================================
 *  LOGOUT
 *  GET /api/auth/logout
 * ================================
 */
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("ai-resume.sid");
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

export default router;
