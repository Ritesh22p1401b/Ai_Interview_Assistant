import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data = [] }) => {
  return (
    <div className="bg-black/40 p-6 rounded-xl border border-gray-800 h-[300px]">
      <h3 className="text-gray-400 mb-4">Performance Trend</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#4ade80" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;