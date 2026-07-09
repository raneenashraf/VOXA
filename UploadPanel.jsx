import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Upload, FileAudio, Sparkles } from "lucide-react";

export default function UploadPanel({ onFileSelected, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  return (
    <motion.section
      className={`voxa-glass voxa-glass-interactive upload-panel ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.flac"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        disabled={isProcessing}
      />

      <div className="upload-icon-wrapper">
        <Mic size={34} />
      </div>

      <h3 className="upload-title">
        {selectedFile ? `Selected: ${selectedFile.name}` : "Upload Audio or Drag & Drop"}
      </h3>
      <p className="upload-description">
        {selectedFile
          ? `Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Ready for AI accessibility processing.`
          : "Supported formats: MP3, WAV, M4A, FLAC up to 200MB."}
      </p>

      <div className="format-badges">
        <span className="format-badge">MP3</span>
        <span className="format-badge">WAV</span>
        <span className="format-badge">M4A</span>
        <span className="format-badge">FLAC</span>
      </div>

      <div className="upload-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Upload size={18} />
          <span>{selectedFile ? "Change Audio File" : "Choose Audio File"}</span>
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            try {
              const res = await fetch("http://localhost:8000/api/sample");
              if (!res.ok) throw new Error("Could not fetch sample audio");
              const blob = await res.blob();
              const sampleFile = new File([blob], "sample_voxa_speech.wav", { type: "audio/wav" });
              setSelectedFile(sampleFile);
              onFileSelected(sampleFile);
            } catch (err) {
              alert("Ensure backend server is running on localhost:8000");
            }
          }}
          disabled={isProcessing}
        >
          <Sparkles size={18} style={{ color: "#06B6D4" }} />
          <span>Try Sample Audio</span>
        </button>
      </div>
    </motion.section>
  );
}
