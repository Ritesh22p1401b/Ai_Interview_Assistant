import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);

  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  /* ---------------- FETCH INTERVIEW ---------------- */
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        setQuestions(res.data.questions || []);
      } catch (error) {
        console.error("Fetch interview error:", error);
      }
    };

    fetchInterview();
  }, [id]);

  /* ---------------- SPEECH ---------------- */
  useEffect(() => {
    if (questions.length && questions[current]) {
      const speech = new SpeechSynthesisUtterance(questions[current]);
      speech.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    }
  }, [questions, current]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!questions.length) return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, questions]);

  /* ---------------- RECORDING ---------------- */
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
    setRecordingStart(Date.now());
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submitAnswer = async () => {
    if (!audioBlob || loading) return;

    setLoading(true);

    const duration =
      recordingStart ? Math.floor((Date.now() - recordingStart) / 1000) : 0;

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("interviewId", id);
    formData.append("questionIndex", current);
    formData.append("audioDuration", duration);

    try {
      const res = await API.post("/interview/submit-audio", formData);

      setScore(res.data.score);
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    stopRecording();
    setTimeout(submitAnswer, 800);
  };

  const handleNext = () => {
    clearInterval(timerRef.current);

    setTimer(60);
    setScore(null);
    setFeedback("");
    setAudioBlob(null);
    setRecordingStart(null);

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
    } else {
      navigate(`/result/${id}`);
    }
  };

  if (!questions.length) return <p>Loading interview...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h3>Time Left: {timer}s</h3>

      <h4>Question {current + 1}</h4>
      <p>{questions[current]}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={startRecording} disabled={loading}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={loading}>
          Stop
        </button>
        <button onClick={submitAnswer} disabled={loading}>
          Submit
        </button>
      </div>

      {loading && <p>Evaluating your answer...</p>}

      {score !== null && (
        <div style={{ marginTop: 20 }}>
          <h4>Score: {score}/10</h4>
          <p>{feedback}</p>
          <button onClick={handleNext}>
            {current + 1 < questions.length
              ? "Next Question"
              : "View Result"}
          </button>
        </div>
      )}
    </div>
  );
}