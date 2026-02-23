import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/upload")}>Upload Resume</button>
        <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}