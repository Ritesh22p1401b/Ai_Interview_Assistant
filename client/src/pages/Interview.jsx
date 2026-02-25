import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";
import AISphere from "../components/AISphere";


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
    <div className="min-h-screen bg-gradient-to-b from-[#050b18] via-black to-[#020611] text-white flex flex-col">

      {/* ================= TOP QUESTION ================= */}
      <div className="pt-10 px-8 text-center">
        <div className="flex justify-between text-sm text-blue-300 mb-4 opacity-70">
          <span>
            Question {current + 1} / {questions.length}
          </span>

          {isRecording && (
            <span className="text-cyan-400 font-medium tracking-wider">
              {timer}s
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-light leading-relaxed max-w-4xl mx-auto tracking-wide">
          {questions[current]}
        </h2>
      </div>

      {/* ================= AI SPHERE ================= */}
      <div className="flex-1 flex items-center justify-center relative">

        {/* Glow Aura Behind Sphere */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full" />

        <AISphere isSpeaking={isAISpeaking} />
      </div>

      {/* ================= STATUS TEXT ================= */}
      <div className="text-center mb-6">
        {isAISpeaking && (
          <p className="text-cyan-400 tracking-widest text-sm animate-pulse">
            AI SPEAKING...
          </p>
        )}

        {isRecording && (
          <p className="text-red-400 tracking-widest text-sm animate-pulse">
            ● RECORDING
          </p>
        )}

        {loading && (
          <p className="text-cyan-300 tracking-widest text-sm">
            Processing Answer...
          </p>
        )}
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="pb-10 flex justify-center gap-6">

        <button
          onClick={startRecording}
          disabled={isAISpeaking || isRecording || loading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium tracking-wide 
                    hover:scale-105 transition disabled:opacity-40"
        >
          Start
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-medium tracking-wide 
                    hover:scale-105 transition disabled:opacity-40"
        >
          Stop
        </button>

        <button
          onClick={submitAnswer}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg font-medium tracking-wide 
                    hover:scale-105 transition disabled:opacity-40"
        >
          Submit
        </button>

        <button
          onClick={skipQuestion}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-medium tracking-wide 
                    hover:scale-105 transition disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
