import Resume from "../models/Resume.model.js";

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Resume.findById(id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Return mock questions for now (replace with AI result later)
    res.status(200).json({
      interviewId: interview._id,
      questions: [
        "Explain your last project in detail.",
        "What is REST API and how does it work?",
        "Explain MongoDB indexing.",
      ],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};