import { useLocation } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const score = location.state?.score;

  return (
    <div>
      <h2>Interview Completed</h2>
      <h3>Your Score: {score}</h3>
    </div>
  );
}