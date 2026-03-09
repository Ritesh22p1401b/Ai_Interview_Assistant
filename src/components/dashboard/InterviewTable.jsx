import { useNavigate } from "react-router-dom";

const InterviewTable = ({ results }) => {

  const navigate = useNavigate();

  return (
    <div className="bg-black/40 border border-green-400/20 backdrop-blur-xl rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Interview History
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="pb-3">Date</th>
              <th className="pb-3">Resume</th>
              <th className="pb-3">Score</th>
            </tr>
          </thead>

          <tbody>

            {results.map((r) => (
              <tr
                key={r._id}
                onClick={() => navigate(`/report/${r._id}`)}
                className="border-b border-gray-800 hover:bg-black/30 cursor-pointer"
              >

                <td className="py-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                <td>{r.resumeName}</td>

                <td className="text-green-400 font-semibold">
                  {r.totalScore}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default InterviewTable;