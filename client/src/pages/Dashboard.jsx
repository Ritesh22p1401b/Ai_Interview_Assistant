import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative overflow-hidden">

      {/* AI Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-green-400/20 blur-[150px] rounded-full top-20"></div>

      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
        The future of interviews
        <br />
        is <span className="text-green-400">Human</span> +{" "}
        <span className="text-green-400">AI</span>
      </h1>

      <p className="mt-6 text-gray-400 max-w-2xl text-lg">
        Upload your resume, receive AI-generated technical questions,
        answer within a timed environment, and get a performance score instantly.
      </p>

      <button
        onClick={() => navigate("/upload-resume")}
        className="mt-10 px-8 py-4 bg-green-400 text-black text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition duration-300"
      >
        Start Interview
      </button>
    </section>
  );
};

export default Dashboard;