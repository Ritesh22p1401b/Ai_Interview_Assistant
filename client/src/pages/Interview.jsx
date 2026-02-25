import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axios";

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

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
      } catch (error) {
        console.error(error);
      }
    };
    fetchInterview();
  }, [id]);

  /* ---------------- AI SPEAK QUESTION ---------------- */
  useEffect(() => {
    if (!questions[current]) return;

    setIsAISpeaking(true);
    setTimer(60); // reset timer but do not start

    const speech = new SpeechSynthesisUtterance(questions[current]);
    speech.lang = "en-US";

    speech.onend = () => {
      setIsAISpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }, [questions, current]);

  /* ---------------- START TIMER ONLY WHEN RECORDING ---------------- */
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
    if (isAISpeaking) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.start();
    setIsRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  /* ---------------- SUBMIT ANSWER ---------------- */
  const submitAnswer = async () => {
    if (!chunksRef.current.length || loading) return;

    setLoading(true);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("interviewId", id);
    formData.append("questionIndex", current);

    try {
      await API.post("/interview/submit-audio", formData);

      // Move to next question automatically
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        navigate(`/result/${id}`);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setTimer(60);
      setIsRecording(false);
    }
  };

  const handleAutoSubmit = () => {
    stopRecording();
    setTimeout(submitAnswer, 500);
  };

  if (!questions.length) return <p>Loading Interview...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">

      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-xl shadow-lg">

        {/* Timer */}
        <div className="text-right text-green-400 font-semibold">
          {isRecording && <p>Time Left: {timer}s</p>}
        </div>

        {/* Question */}
        <h3 className="text-2xl font-bold mb-6">
          Question {current + 1}
        </h3>

        <p className="text-lg mb-6">{questions[current]}</p>

        {/* AI Speaking Wave Effect */}
        <div className="flex justify-center items-center h-16 mb-8">
          {isAISpeaking && (
            <div className="flex gap-2">
              <span className="w-2 h-8 bg-green-400 animate-bounce"></span>
              <span className="w-2 h-10 bg-green-400 animate-bounce delay-100"></span>
              <span className="w-2 h-6 bg-green-400 animate-bounce delay-200"></span>
              <span className="w-2 h-9 bg-green-400 animate-bounce delay-300"></span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          <button
            onClick={startRecording}
            disabled={isAISpeaking || isRecording}
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
            disabled={isRecording || loading}
            className="px-6 py-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
          >
            Submit
          </button>
        </div>

        {loading && (
          <p className="text-center mt-6 text-green-400">
            Evaluating your answer...
          </p>
        )}
      </div>
    </div>
  );
}