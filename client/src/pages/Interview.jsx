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

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        setQuestions(res.data.allQuestions || []);
        setStatus(res.data.status || "in-progress");
        if (res.data.status === "completed") navigate(`/result/${id}`);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  useEffect(() => {
    if (!questions[current] || status === "completed") return;
    
    setTimer(60);
    clearInterval(timerRef.current);
    
    setIsAISpeaking(true);
    setIsRecording(false);
    chunksRef.current = [];
    window.speechSynthesis.cancel();
    
    const speech = new SpeechSynthesisUtterance(questions[current]);
    speech.lang = "en-US";
    speech.onend = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(speech);

    return () => window.speechSynthesis.cancel();
  }, [questions, current, status]);

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

  const startRecording = async () => {
    if (isAISpeaking || isRecording || loading) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.start(1000);
      setIsRecording(true);
      startTimer(); 
    } catch (err) {
      alert("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const submitAnswer = async () => {
    if (!chunksRef.current.length || loading) {
      alert("No recording detected.");
      return;
    }
    stopRecording();
    setLoading(true);
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "answer.webm");
    formData.append("interviewId", id);
    formData.append("questionIndex", current);
    try {
      const res = await API.post("/interview/submit-audio", formData);
      if (res.data.status === "completed") navigate(`/result/${id}`);
      else goToNext();
    } catch (error) {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const skipQuestion = async () => {
    if (loading) return;
    stopRecording();
    window.speechSynthesis.cancel();
    setLoading(true);
    try {
      const res = await API.post("/interview/skip-question", { interviewId: id, questionIndex: current });
      if (res.data.status === "completed") navigate(`/result/${id}`);
      else goToNext();
    } catch (error) {
      alert("Skip failed.");
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (current + 1 < questions.length) setCurrent((prev) => prev + 1);
    else navigate(`/result/${id}`);
  };

  const handleAutoSubmit = () => {
    if (!isRecording) return;
    setTimeout(() => submitAnswer(), 300);
  };

  if (!questions.length) return <p className="text-center mt-20 text-cyan-400">Loading Interview...</p>;

  return (
    <div className="h-[calc(100vh-48px)] bg-[#0b0f0c] text-white flex flex-col overflow-hidden relative">

      {/* 1. TOP SECTION: pt-6 ensures space from Navbar, text-sm minimizes question font */}
      <div className="h-[25%] flex flex-col justify-end px-8 pb-4 text-center z-20 relative pt-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full text-[11px] font-mono tracking-widest mb-4">
          
          <div className="flex items-center gap-2 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
            <span className="text-cyan-400 font-bold">{current + 1}</span>
            <span className="text-cyan-400/30">/</span>
            <span className="text-cyan-400/60">{questions.length}</span>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
            <span className={`text-lg font-bold min-w-[3ch] ${isRecording ? "text-red-500 animate-pulse" : "text-cyan-400"}`}>
              {timer}s
            </span>
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-cyan-900'}`}></div>
          </div>
        </div>
        
        {/* Minimized Question Font (text-sm = 14px) */}
        <h2 className="text-sm md:text-base font-light max-w-3xl mx-auto leading-relaxed text-cyan-100 italic">
          "{questions[current]}"
        </h2>
      </div>

      {/* 2. MIDDLE SECTION */}
      <div className="h-[50%] w-full relative z-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[60%] h-[60%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
        </div>
        <AISphere isSpeaking={isAISpeaking} />
      </div>

      {/* 3. BOTTOM SECTION */}
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
            className="w-14 h-14 rounded-full border border-cyan-800 flex flex-col items-center justify-center text-[9px] font-bold uppercase text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-10 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
          >
            Start
          </button>

          <button
            onClick={submitAnswer}
            disabled={loading || !isRecording}
            className="px-12 py-3.5 bg-cyan-500 text-black rounded-full font-black text-xs tracking-[0.2em] hover:bg-cyan-400 hover:scale-105 transition-all active:scale-95 disabled:opacity-20 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            SUBMIT ANSWER
          </button>

          <button
            onClick={skipQuestion}
            disabled={loading}
            className="w-14 h-14 rounded-full border border-cyan-800 flex flex-col items-center justify-center text-[9px] font-bold uppercase text-cyan-400 hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-10 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}