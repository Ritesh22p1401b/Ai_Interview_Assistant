import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // The logic you requested: redirect based on auth status
  const handleStartInterview = () => {
    if (isAuthenticated) {
      navigate("/upload"); // If logged in, go to resume upload
    } else {
      navigate("/login");  // If not logged in, go to login
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 min-h-[80vh] overflow-hidden">
      
      {/* Visual Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-green-400/10 blur-[120px] rounded-full top-0 -z-10"></div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl z-10">
        Master Your Next <br /> 
        <span className="text-green-400">Technical Interview</span>
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-gray-400 max-w-2xl text-lg z-10 leading-relaxed">
        Upload your resume, get AI-generated technical questions, and 
        receive an intelligent performance score instantly.
      </p>

      {/* PRIMARY ACTION BUTTON */}
      <div className="mt-10 z-10">
        <button
          onClick={handleStartInterview}
          className="px-10 py-4 bg-green-400 text-black text-lg font-bold rounded-full shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:scale-105 hover:bg-green-300 transition-all duration-300"
        >
          Start Interview
        </button>
        
        {!isAuthenticated && (
          <p className="mt-4 text-xs text-gray-500 italic">
            * You will be asked to login first
          </p>
        )}
      </div>

      {/* Features Grid */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
        <FeatureCard 
          title="AI Analysis" 
          desc="Custom questions based on your specific tech stack." 
        />
        <FeatureCard 
          title="Real-time Timer" 
          desc="Practice under pressure with a simulated environment." 
        />
        <FeatureCard 
          title="Instant Feedback" 
          desc="Get scored on accuracy, depth, and communication." 
        />
      </div>
    </section>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-green-400/30 transition-all group">
    <h3 className="text-lg font-bold mb-2 text-green-400">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default Home;