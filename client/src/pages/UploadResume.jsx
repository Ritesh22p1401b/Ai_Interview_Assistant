import { useState } from "react";
import API from "../app/axios";
import { useNavigate } from "react-router-dom";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await API.post("/resume/upload", formData);
    alert("Resume uploaded successfully!");
    navigate(`/interview/${res.data.interviewId}`);
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}