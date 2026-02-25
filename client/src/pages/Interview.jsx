import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("in-progress");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  /* ---------------- FETCH INTERVIEW ---------------- */
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        setQuestions(res.data.allQuestions || []);
        setStatus(res.data.status || "in-progress");

        if (res.data.status === "completed") {
          navigate(`/result/${id}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  /* ---------------- AI SPEAK QUESTION ---------------- */
  useEffect(() => {
    if (!questions[current] || status === "completed") return;

    setTimer(45);
    setIsAISpeaking(true);
    setIsRecording(false);
    chunksRef.current = [];

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(questions[current]);
    speech.lang = "en-US";
    speech.rate = 1;

    speech.onend = () => setIsAISpeaking(false);

    window.speechSynthesis.speak(speech);
  }, [questions, current, status]);

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ---------------- RECORDING ---------------- */
  const startRecording = async () => {
    if (isAISpeaking || isRecording || loading) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(1000);
      setIsRecording(true);
      startTimer();

    } catch (err) {
      alert("Microphone permission denied.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  /* ---------------- SUBMIT (EVALUATE) ---------------- */
  const submitAnswer = async () => {
    if (!chunksRef.current.length || loading) {
      alert("No recording detected.");
      return;
    }

    stopRecording();
    setLoading(true);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append("audio", blob, "answer.webm");
    formData.append("interviewId", id);
    formData.append("questionIndex", current);

    try {
      const res = await API.post("/interview/submit-audio", formData);

      if (res.data.status === "completed") {
        navigate(`/result/${id}`);
        return;
      }

      goToNext();

    } catch (error) {
      console.error("Submit error:", error);
      alert(error?.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SKIP QUESTION ---------------- */
  const skipQuestion = async () => {
    if (loading) return;

    stopRecording();
    setLoading(true);

    try {
      const res = await API.post("/interview/skip-question", {
        interviewId: id,
        questionIndex: current,
      });

      if (res.data.status === "completed") {
        navigate(`/result/${id}`);
        return;
      }

      goToNext();

    } catch (error) {
      console.error("Skip error:", error);
      alert(error?.response?.data?.message || "Skip failed.");
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      navigate(`/result/${id}`);
    }
  };

  const handleAutoSubmit = () => {
    if (!isRecording) return;
    setTimeout(() => submitAnswer(), 300);
  };

  if (!questions.length)
    return <p className="text-center mt-20">Loading Interview...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white p-8">
      <div className="w-full max-w-3xl bg-gray-800 p-10 rounded-2xl shadow-2xl">

        {/* PROGRESS */}
        <div className="flex justify-between mb-6 text-sm text-gray-400">
          <span>
            Question {current + 1} / {questions.length}
          </span>
          {isRecording && <span className="text-green-400">Time: {timer}s</span>}
        </div>

        {/* QUESTION */}
        <h3 className="text-2xl font-bold mb-4">
          {questions[current]}
        </h3>

        {/* AI SPEAKING */}
        {isAISpeaking && (
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="w-2 h-10 bg-green-400 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {/* RECORDING INDICATOR */}
        {isRecording && (
          <div className="text-center text-red-500 font-semibold mb-6 animate-pulse">
            ● Recording...
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={startRecording}
            disabled={isAISpeaking || isRecording || loading}
            className="px-6 py-3 bg-green-500 rounded-lg font-semibold disabled:opacity-50"
          >
            Start
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="px-6 py-3 bg-yellow-500 rounded-lg font-semibold disabled:opacity-50"
          >
            Stop
          </button>

          <button
            onClick={submitAnswer}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
          >
            Submit
          </button>

          <button
            onClick={skipQuestion}
            disabled={loading}
            className="px-6 py-3 bg-red-600 rounded-lg font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {loading && (
          <p className="text-center mt-6 text-green-400">
            Processing...
          </p>
        )}
      </div>
    </div>
  );
}