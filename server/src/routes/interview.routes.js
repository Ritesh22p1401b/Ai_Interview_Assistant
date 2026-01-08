import express from "express";

const router = express.Router();

router.get("/start", (req, res) => {
  res.json({
    questions: [
      "Explain your last project",
      "What is REST API?",
      "Explain MongoDB indexing",
    ],
  });
});

export default router;
