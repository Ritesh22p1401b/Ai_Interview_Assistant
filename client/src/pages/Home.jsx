import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (user) {
      navigate("/upload-resume");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden min-h-[90vh]">

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-green-400/20 blur-[150px] rounded-full top-10"></div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl z-10">
        The future of interviews
        <br />
        is <span className="text-green-400">Human</span> +{" "}
        <span className="text-green-400">AI</span>
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-gray-400 max-w-2xl text-lg z-10">
        Upload your resume, get AI-generated technical questions,
        answer within a timed environment, and receive an intelligent
        performance score instantly.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex gap-6 z-10">
        <button
          onClick={handlePrimaryClick}
          className="px-8 py-4 bg-green-400 text-black text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition duration-300"
        >
          {user ? "Start Interview" : "Login to Start"}
        </button>

        {!user && (
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 border border-gray-700 text-white rounded-xl hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Feature Cards */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
        
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-gray-800 hover:border-green-400 transition">
          <h3 className="text-xl font-semibold mb-3 text-green-400">
            Resume-Based Questions
          </h3>
          <p className="text-gray-400">
            AI analyzes your resume and generates personalized technical questions.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-gray-800 hover:border-green-400 transition">
          <h3 className="text-xl font-semibold mb-3 text-green-400">
            Timed Interview Mode
          </h3>
          <p className="text-gray-400">
            Simulate real interview pressure with countdown timers.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-gray-800 hover:border-green-400 transition">
          <h3 className="text-xl font-semibold mb-3 text-green-400">
            Instant AI Scoring
          </h3>
          <p className="text-gray-400">
            Get intelligent evaluation and performance insights immediately.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Home;