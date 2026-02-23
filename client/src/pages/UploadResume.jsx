import { useState } from "react";

const UploadResume = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center py-20">

      <h2 className="text-4xl font-bold mb-8">
        Upload Your Resume
      </h2>

      <div className="border-2 border-dashed border-green-400 p-10 rounded-xl w-[400px] text-center bg-black/40 backdrop-blur-md">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <button
          className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg hover:scale-105 transition"
        >
          Upload & Start
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