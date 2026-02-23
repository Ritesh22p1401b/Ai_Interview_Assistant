import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800 bg-black/60 backdrop-blur-md">
        <Link to="/" className="text-2xl font-bold">
          AI<span className="text-green-400">Interview</span>
        </Link>

        <div className="flex gap-6 items-center">

          <Link to="/" className="hover:text-green-400">
            Home
          </Link>

          {user && (
            <Link to="/dashboard" className="hover:text-green-400">
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />
    </div>
  );
};

export default Layout;