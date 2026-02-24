import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(60);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  const chunksRef = useRef([]);

  // Fetch questions
  useEffect(() => {
    API.get(`/interview/${id}`).then(res => {
      setQuestions(res.data.questions);
    });
  }, [id]);

  // Speak question when it changes
  useEffect(() => {
    if (questions.length && questions[current]) {
      const speech = new SpeechSynthesisUtterance(questions[current]);
      speech.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    }
  }, [questions, current]);

  // Timer logic
  useEffect(() => {
    if (!questions.length) return;

    if (timer === 0) {
      stopRecording();
      submitAnswer();
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🎤 Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      chunksRef.current = [];
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  // Submit audio to backend
  const submitAnswer = async () => {
    if (!audioBlob) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("interviewId", id);
    formData.append("questionIndex", current);

    const res = await API.post("/interview/submit-audio", formData);

    setScore(res.data.score);
    setFeedback(res.data.feedback);
    setLoading(false);
  };

  const handleNext = () => {
    setTimer(60);
    setScore(null);
    setFeedback("");
    setAudioBlob(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      navigate(`/result/${id}`);
    }
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h3>Time Left: {timer}s</h3>

      <h4>Question {current + 1}</h4>
      <p>{questions[current]}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop</button>
        <button onClick={submitAnswer}>Submit</button>
      </div>

      {loading && <p>Evaluating your answer...</p>}

      {score !== null && (
        <div style={{ marginTop: 20 }}>
          <h4>Score: {score}/10</h4>
          <p>{feedback}</p>
          <button onClick={handleNext}>Next Question</button>
        </div>
      )}
    </div>
  );
}
