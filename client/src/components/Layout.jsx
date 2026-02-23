import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "text-green-400" : "hover:text-green-400";

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800 bg-black/60 backdrop-blur-md">

        <Link to="/" className="text-2xl font-bold">
          AI<span className="text-green-400">Interview</span>
        </Link>

        <div className="flex gap-6 items-center">

          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
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
      <main className="min-h-[90vh]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;