import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axios"; // your axios instance

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", form);

      // 🔥 IMPORTANT LINE
      await login(response.data);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="bg-black/40 backdrop-blur-md border border-gray-800 p-10 rounded-2xl w-full max-w-md shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}