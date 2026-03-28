import { useNavigate } from "react-router-dom";

const InterviewTable = ({ results = [] }) => {
  const navigate = useNavigate();

  if (!results.length) {
    return (
      <div className="text-center text-gray-400">
        No interviews found
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
      <h3 className="text-gray-400 mb-4">Interview History</h3>

      <div className="space-y-4">
        {results.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/report/${item._id}`)}
            className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-black/60 transition"
          >
            <p className="text-sm text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>

            <p className="text-green-400 font-semibold">
              Score: {item.totalScore}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewTable;