export const scoreAnswers = async (answers) => {
  return {
    finalScore: Math.floor(Math.random() * 30) + 70,
    breakdown: {
      technical: 80,
      communication: 75,
      confidence: 85,
      relevance: 90
    }
  };
};
