const StatsCards = ({ analytics = {} }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-black/40 p-6 rounded-xl border border-gray-800 text-center">
        <h3 className="text-gray-400">Total Interviews</h3>
        <p className="text-3xl font-bold text-green-400 mt-2">
          {analytics.totalInterviews || 0}
        </p>
      </div>

      <div className="bg-black/40 p-6 rounded-xl border border-gray-800 text-center">
        <h3 className="text-gray-400">Average Score</h3>
        <p className="text-3xl font-bold text-green-400 mt-2">
          {analytics.averageScore?.toFixed?.(1) || 0}
        </p>
      </div>

      <div className="bg-black/40 p-6 rounded-xl border border-gray-800 text-center">
        <h3 className="text-gray-400">Latest Score</h3>
        <p className="text-3xl font-bold text-green-400 mt-2">
          {analytics.trend?.length
            ? analytics.trend[analytics.trend.length - 1].score
            : 0}
        </p>
      </div>

    </div>
  );
};

export default StatsCards;