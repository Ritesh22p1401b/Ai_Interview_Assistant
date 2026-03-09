import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

const SkillRadar = ({ data }) => {

  const chartData = [
    { skill: "Technical", score: data.technical },
    { skill: "Problem Solving", score: data.problemSolving },
    { skill: "Communication", score: data.communication },
    { skill: "Confidence", score: data.confidence }
  ];

  return (
    <div className="bg-black/40 border border-green-400/20 backdrop-blur-xl rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Skill Breakdown
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>

          <PolarGrid />

          <PolarAngleAxis dataKey="skill" />

          <Radar
            dataKey="score"
            stroke="#4ade80"
            fill="#4ade80"
            fillOpacity={0.4}
          />

        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SkillRadar;