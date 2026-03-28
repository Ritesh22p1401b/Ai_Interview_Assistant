import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const SkillRadar = ({ data = {} }) => {

  const chartData = [
    { skill: "Technical", value: data.technical || 0 },
    { skill: "Problem Solving", value: data.problemSolving || 0 },
    { skill: "Communication", value: data.communication || 0 },
    { skill: "Confidence", value: data.confidence || 0 },
  ];

  return (
    <div className="bg-black/40 p-6 rounded-xl border border-gray-800 h-[300px]">
      <h3 className="text-gray-400 mb-4">Skill Breakdown</h3>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <Radar dataKey="value" stroke="#4ade80" fill="#4ade80" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadar;