import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/axios";

import StatsCards from "../components/dashboard/StatsCards";
import TrendChart from "../components/dashboard/TrendChart";
import SkillRadar from "../components/dashboard/SkillRadar";
import InterviewTable from "../components/dashboard/InterviewTable";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        const [analyticsRes, resultsRes] = await Promise.all([
          API.get("/dashboard/analytics"),
          API.get("/dashboard/results"),
        ]);

        setAnalytics(analyticsRes.data || {});
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error(
          "Dashboard load error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  /* NOT LOGGED IN */

  if (!isAuthenticated) {
    return (
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-green-400/20 blur-[150px] rounded-full top-20"></div>

        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Login to view your <span className="text-green-400">Dashboard</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          Your interview analytics, performance graphs and AI feedback will
          appear here.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-10 px-8 py-4 bg-green-400 text-black text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition duration-300"
        >
          Login First
        </button>
      </section>
    );
  }

  /* LOADING */

  if (loading) {
    return (
      <div className="text-center py-40 text-gray-400">
        Loading Dashboard...
      </div>
    );
  }

  /* DASHBOARD */

  return (
    <section className="relative px-6 py-20 overflow-hidden">
      <div className="absolute w-[700px] h-[700px] bg-green-400/20 blur-[150px] rounded-full top-0 left-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center">
          AI Interview <span className="text-green-400">Dashboard</span>
        </h1>

        {/* Stats Cards */}
        <StatsCards analytics={analytics} />

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <TrendChart data={analytics?.trend || []} />
          <SkillRadar data={analytics?.segmentScores || {}} />
        </div>

        {/* Interview History */}
        <InterviewTable results={results || []} />
      </div>
    </section>
  );
};

export default Dashboard;