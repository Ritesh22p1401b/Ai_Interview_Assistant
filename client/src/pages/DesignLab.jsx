import { useState } from "react";
import AICube from "../components/AICube";
import AISphere from "../components/AISphere";

export default function DesignLab() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [design, setDesign] = useState("cube");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* TOP CONTROL PANEL */}
      <div className="p-6 flex justify-between items-center border-b border-gray-800">

        <div className="flex gap-4">
          <button
            onClick={() => setDesign("cube")}
            className={`px-4 py-2 rounded ${
              design === "cube" ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            Cube
          </button>

          <button
            onClick={() => setDesign("sphere")}
            className={`px-4 py-2 rounded ${
              design === "sphere" ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            Sphere
          </button>
        </div>

        <button
          onClick={() => setIsSpeaking((prev) => !prev)}
          className="px-6 py-2 bg-green-600 rounded-lg hover:scale-105 transition"
        >
          {isSpeaking ? "Stop Speaking" : "AI Speaking"}
        </button>

      </div>

      {/* 3D CANVAS AREA */}
      <div className="flex-1 flex items-center justify-center">
        {design === "cube" ? (
          <AICube isSpeaking={isSpeaking} />
        ) : (
          <AISphere isSpeaking={isSpeaking} />
        )}
      </div>

    </div>
  );
}