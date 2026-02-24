import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateFile = (selectedFile) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Only PDF, DOC, DOCX files are allowed.");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("File size must be less than 5MB.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    try {
      setLoading(true);
      setMessage("Uploading resume...");
      
      const formData = new FormData();
      formData.append("resume", file);

      const response = await API.post(
        "/resume/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Analyzing resume & generating questions...");

      // Small UX delay for smoother transition
      setTimeout(() => {
        navigate(`/interview/${response.data.interviewId}`);
      }, 1200);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage(error?.response?.data?.message || "Upload failed.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-4xl font-bold mb-8">
        Upload Your Resume
      </h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileSelect(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed p-10 rounded-xl w-[420px] text-center bg-black/40 backdrop-blur-md transition
        ${dragActive ? "border-green-500 bg-black/60" : "border-green-400"}`}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="mb-6"
          disabled={loading}
        />

        <p className="text-sm text-gray-400 mb-4">
          Drag & drop your resume here or select file
        </p>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Start Interview"}
        </button>
      </div>

      {file && (
        <div className="mt-6 text-green-400 text-center">
          <p className="font-semibold">Selected File:</p>
          <p>{file.name}</p>
        </div>
      )}

      {message && (
        <p className="mt-6 text-yellow-400 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadResume;