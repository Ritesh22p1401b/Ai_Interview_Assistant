import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";
import AISphere from "../components/AISphere";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("in-progress");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  /* ================= FETCH INTERVIEW ================= */
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        const allQuestions = res.data.allQuestions || [];

        if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
          console.error("No questions received.");
          return;
        }

        setQuestions(allQuestions);
        setStatus(res.data.status);

        if (res.data.status === "completed") {
          navigate(`/result/${id}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  /* ================= AI SPEAKS QUESTION ================= */
  useEffect(() => {
    if (!questions.length) return;
    if (!questions[current]) return;
    if (status === "completed") return;

    setTimer(60);
    clearInterval(timerRef.current);
    setIsAISpeaking(true);
    setIsRecording(false);
    chunksRef.current = [];

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      String(questions[current])
    );
    speech.lang = "en-US";
    speech.onend = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(speech);

    return () => window.speechSynthesis.cancel();
  }, [questions, current, status]);

  /* ================= TIMER ================= */
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

  /* ================= RECORD ================= */
  const startRecording = async () => {
    if (isAISpeaking || isRecording || loading) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      alert("Microphone permission denied.");
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

  /* ================= SUBMIT ================= */
  const submitAnswer = async () => {
    if (!chunksRef.current.length || loading) {
      alert("No recording detected.");
      return;
    }

    stopRecording();
    setLoading(true);

    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("interviewId", id);
      formData.append("questionIndex", Number(current));

      const res = await API.post(
        "/interview/submit-audio",
        formData,
        { withCredentials: true }
      );

      if (res.data.status === "completed") {
        navigate(`/result/${id}`);
      } else {
        goToNext();
      }
    } catch (error) {
      console.error(error);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SKIP ================= */
  const skipQuestion = async () => {
    if (loading) return;

    stopRecording();
    window.speechSynthesis.cancel();
    setLoading(true);

    try {
      const res = await API.post(
        "/interview/skip-question",
        {
          interviewId: id,
          questionIndex: Number(current),
        },
        { withCredentials: true }
      );

      if (res.data.status === "completed") {
        navigate(`/result/${id}`);
      } else {
        goToNext();
      }
    } catch (error) {
      console.error(error);
      alert("Skip failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= NEXT ================= */
  const goToNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      navigate(`/result/${id}`);
    }
  };

  const handleAutoSubmit = () => {
    if (isRecording) {
      setTimeout(() => submitAnswer(), 300);
    }
  };

  if (!questions.length) {
    return (
      <p className="text-center mt-20 text-cyan-400">
        Loading Interview...
      </p>
    );
  }

  return (
    <div className="h-[calc(100vh-48px)] bg-[#0b0f0c] text-white flex flex-col overflow-hidden relative">

      {/* TOP */}
      <div className="h-[25%] flex flex-col justify-end px-8 pb-4 text-center z-20 relative pt-6">

        <div className="flex justify-between items-center max-w-4xl mx-auto w-full text-[11px] font-mono tracking-widest mb-4">

          <div className="flex items-center gap-2 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
            <span className="text-cyan-400 font-bold">
              {current + 1}
            </span>
            <span className="text-cyan-400/30">/</span>
            <span className="text-cyan-400/60">
              {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-4 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
            <span
              className={`text-lg font-bold min-w-[3ch] ${
                isRecording
                  ? "text-red-500 animate-pulse"
                  : "text-cyan-400"
              }`}
            >
              {timer}s
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-sm md:text-base font-light max-w-3xl mx-auto leading-relaxed text-cyan-100 italic">
          {questions[current] ? `"${questions[current]}"` : ""}
        </h2>
      </div>

      {/* MIDDLE */}
      <div className="h-[50%] w-full relative z-10">
        <AISphere isSpeaking={isAISpeaking} />
      </div>

      {/* BOTTOM */}
      <div className="h-[25%] flex flex-col justify-start items-center pt-2 z-20 relative">
        <div className="h-4 mb-8">
          {isAISpeaking && (
            <p className="text-cyan-400 text-[9px] font-bold tracking-[0.5em] uppercase animate-pulse">
              Interviewer Speaking
            </p>
          )}
          {isRecording && (
            <p className="text-red-500 text-[9px] font-bold tracking-[0.5em] uppercase animate-pulse">
              Recording Response
            </p>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={startRecording}
            disabled={isAISpeaking || isRecording || loading}
            className="w-14 h-14 rounded-full border border-cyan-800 text-cyan-400 disabled:opacity-20"
          >
            Start
          </button>

          <button
            onClick={submitAnswer}
            disabled={loading || !isRecording}
            className="px-12 py-3.5 bg-cyan-500 text-black rounded-full disabled:opacity-20"
          >
            SUBMIT
          </button>

          <button
            onClick={skipQuestion}
            disabled={loading}
            className="w-14 h-14 rounded-full border border-cyan-800 text-cyan-400 disabled:opacity-20"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}