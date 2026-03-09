const StatsCards = ({ analytics }) => {

  const cards = [
    { title: "Total Interviews", value: analytics.totalInterviews },
    { title: "Average Score", value: analytics.averageScore },
    { title: "Best Score", value: analytics.bestScore },
    { title: "Latest Score", value: analytics.latestScore }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">

      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-black/40 border border-green-400/20 backdrop-blur-xl rounded-xl p-6 text-center hover:border-green-400 transition"
        >
          <p className="text-gray-400">{card.title}</p>

          <h2 className="text-3xl font-bold mt-2 text-green-400">
            {card.value}
          </h2>
        </div>
      ))}

    </div>
  );
};

export default StatsCards;