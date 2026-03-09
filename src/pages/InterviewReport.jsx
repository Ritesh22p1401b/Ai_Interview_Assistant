import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/axios";

const InterviewReport = () => {

  const { id } = useParams();

  const [report, setReport] = useState(null);

  useEffect(() => {

    async function loadReport() {
      try {

        const res = await API.get(`/dashboard/result/${id}`);
        setReport(res.data);

      } catch (err) {
        console.error(err);
      }
    }

    loadReport();

  }, [id]);

  if (!report) {
    return (
      <div className="text-center py-40 text-gray-400">
        Loading report...
      </div>
    );
  }

  return (
    <section className="relative px-6 py-20 overflow-hidden">

      <div className="absolute w-[700px] h-[700px] bg-green-400/20 blur-[150px] rounded-full top-0 left-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-5xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold text-center">
          Interview <span className="text-green-400">Report</span>
        </h1>

        <div className="bg-black/40 border border-green-400/20 rounded-xl p-6 text-center">
          <h2 className="text-xl">Overall Score</h2>

          <p className="text-4xl font-bold text-green-400 mt-2">
            {report.totalScore}
          </p>

          <p className="text-gray-400 mt-4">
            {report.overallFeedback}
          </p>
        </div>

        {/* Questions */}

        <div className="space-y-6">

          {report.answers.map((q, index) => (
            <div
              key={index}
              className="bg-black/40 border border-gray-800 rounded-xl p-6 space-y-4"
            >

              <h3 className="text-lg font-semibold">
                Question {index + 1}
              </h3>

              <p className="text-gray-300">
                {q.question}
              </p>

              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Your Answer
                </p>

                <p className="text-gray-200">
                  {q.answer}
                </p>
              </div>

              <div className="flex justify-between items-center">

                <span className="text-green-400 font-semibold">
                  Score: {q.score}/10
                </span>

              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">
                  AI Feedback
                </p>

                <p className="text-gray-300">
                  {q.feedback}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                Improve by explaining concepts more clearly and adding technical depth.
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default InterviewReport;