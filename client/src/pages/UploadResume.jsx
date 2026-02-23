import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Resume uploaded successfully!");

      // Navigate to interview page with interviewId
      navigate(`/interview/${response.data.interviewId}`);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">

      <h2 className="text-4xl font-bold mb-8">
        Upload Your Resume
      </h2>

      <div className="border-2 border-dashed border-green-400 p-10 rounded-xl w-[400px] text-center bg-black/40 backdrop-blur-md">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition"
        >
          {loading ? "Uploading..." : "Upload & Start"}
        </button>
      </div>

      {file && (
        <p className="mt-4 text-green-400">
          Selected: {file.name}
        </p>
      )}
    </div>
  );
};

export default UploadResume;