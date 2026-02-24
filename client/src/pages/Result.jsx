import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/axios";

export default function Result() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        setInterview(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading results...</p>;

  if (!interview) return <p className="text-center mt-10">Result not found</p>;

  const totalQuestions = interview.answers.length;
  const totalScore = interview.totalScore || 0;
  const percentage = totalQuestions
    ? ((totalScore / (totalQuestions * 10)) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-lg">

        <h2 className="text-4xl font-bold text-center mb-6">
          Interview Completed
        </h2>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-green-400">
            Total Score: {totalScore}
          </h3>
          <p className="text-gray-300">
            Performance: {percentage}%
          </p>
        </div>

        <div className="space-y-6">
          {interview.answers.map((ans, index) => (
            <div
              key={index}
              className="border border-green-400/30 p-5 rounded-lg"
            >
              <h4 className="font-semibold mb-2">
                Q{index + 1}: {ans.question}
              </h4>

              <p className="text-sm text-gray-300 mb-2">
                <strong>Transcript:</strong> {ans.transcript}
              </p>

              <p className="text-green-400 font-semibold">
                Score: {ans.score}/10
              </p>

              <p className="text-gray-400">
                Feedback: {ans.feedback}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}