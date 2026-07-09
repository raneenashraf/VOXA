import React, { useState } from "react";

export default function UploadButton({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <section className="upload-section">
      <h3 className="upload-title">1. Upload your audio</h3>
      <input
        type="file"
        accept=".wav,.mp3,.flac,.ogg,.m4a"
        onChange={handleFileChange}
        className="upload-input"
      />
      {selectedFile && (
        <p style={{ marginTop: "0.5rem", color: "#444" }}>
          Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}
    </section>
  );
}
