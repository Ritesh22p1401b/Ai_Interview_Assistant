import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../app/axios";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    API.get(`/interview/${id}`).then(res => {
      setQuestions(res.data.questions);
    });
  }, []);

  useEffect(() => {
    if (timer === 0) handleNext();
    const interval = setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleNext = () => {
    setTimer(60);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitInterview();
    }
  };

  const submitInterview = async () => {
    const res = await API.post(`/interview/submit/${id}`, { answers });
    navigate(`/result/${id}`, { state: { score: res.data.score } });
  };

  return questions.length ? (
    <div>
      <h3>Time Left: {timer}s</h3>
      <p>{questions[current]}</p>
      <textarea onChange={(e) => {
        const updated = [...answers];
        updated[current] = e.target.value;
        setAnswers(updated);
      }} />
      <button onClick={handleNext}>Next</button>
    </div>
  ) : <p>Loading...</p>;
}