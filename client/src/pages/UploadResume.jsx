import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const validateFile = (selectedFile) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, DOC, DOCX files are allowed.");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/interview/${response.data.interviewId}`);

    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Upload failed");
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
        />

        <p className="text-sm text-gray-400 mb-4">
          Drag & drop your resume here or select file
        </p>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Start Interview"}
        </button>
      </div>

      {file && (
        <div className="mt-6 text-green-400 text-center">
          <p className="font-semibold">Selected File:</p>
          <p>{file.name}</p>
        </div>
      )}
    </div>
  );
};

export default UploadResume;