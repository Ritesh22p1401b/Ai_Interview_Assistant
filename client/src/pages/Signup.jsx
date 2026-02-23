import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="bg-black/40 backdrop-blur-md border border-gray-800 p-10 rounded-2xl w-full max-w-md shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
          />

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
            className="w-full py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition"
          >
            Sign Up
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}