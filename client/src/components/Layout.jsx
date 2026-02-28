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
    location.pathname === path ? "text-green-400" : "text-gray-400 hover:text-green-400";

  return (
    /* Hide scrollbar logic applied to the main wrapper */
    <div className="min-h-screen bg-[#0b0f0c] text-white flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

      {/* ULTRA SLIM NAVBAR */}
      <nav className="fixed top-0 w-full h-12 flex justify-between items-center px-8 border-b border-gray-800 bg-black/80 backdrop-blur-lg z-50">
        <Link to="/" className="text-lg font-bold">
          AI<span className="text-green-400">Interview</span>
        </Link>

        <div className="flex gap-8 items-center text-sm font-medium">
          <Link to="/" className={`${isActive("/")} transition-colors`}>Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`${isActive("/dashboard")} transition-colors`}>Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${isActive("/login")} transition-colors`}>Login</Link>
              <Link to="/signup" className={`${isActive("/signup")} transition-colors`}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT - flex-grow ensures footer stays at bottom */}
      <main className="pt-12 flex-grow">
        <Outlet />
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="w-full py-8 px-10 border-t border-gray-800 bg-black/40 text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            <span className="text-white font-bold">AI</span><span className="text-green-400 font-bold">Interview</span>
            <p className="mt-1 text-xs opacity-60">© 2026 All rights reserved.</p>
          </div>

          <div className="flex gap-8 text-[10px] font-semibold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-green-400 transition">Privacy</a>
            <a href="#" className="hover:text-green-400 transition">Terms</a>
            <a href="#" className="hover:text-green-400 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;