export const generateQuestions = async (resumeText) => {
  // Replace with OpenAI / Gemini
  return [
    `Explain your experience in ${resumeText.slice(0, 50)}`,
    "Explain your strongest technical skill",
    "Describe a challenging project"
  ];
};
