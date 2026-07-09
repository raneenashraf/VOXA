import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Wand2, BarChart3, Copy, Check, Download } from "lucide-react";
import confetti from "canvas-confetti";

export default function ResultsShowcase({ result }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [typedText, setTypedText] = useState({
    transcript: "",
    simplified: "",
    summary: "",
  });

  useEffect(() => {
    if (!result) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#4ADE80", "#06B6D4", "#22C55E"],
    });

    setTypedText({
      transcript: result.transcript || "",
      simplified: result.simplified_text || "",
      summary: result.summary || "",
    });
  }, [result]);

  if (!result) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadTxt = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voxa-accessibility-result.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="results-grid">
      {/* 1. ORIGINAL TRANSCRIPT CARD */}
      <motion.section
        className="voxa-glass result-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="result-header">
          <div className="result-title-group">
            <div className="result-icon">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="result-title">Original Transcript</h3>
              <p className="result-subtitle">Exact spoken speech-to-text conversion</p>
            </div>
          </div>
          <div className="result-badges">
            <span className="badge-metric">
              Lang: {result.transcription_meta?.language || "EN"}
            </span>
            <span className="badge-metric">
              Confidence: {Math.round((result.transcription_meta?.confidence || 0.98) * 100)}%
            </span>
          </div>
        </div>

        <div className="result-content">{typedText.transcript}</div>

        <div className="result-footer">
          <button
            type="button"
            className={`action-btn ${copiedKey === "transcript" ? "success" : ""}`}
            onClick={() => handleCopy(result.transcript, "transcript")}
          >
            {copiedKey === "transcript" ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedKey === "transcript" ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={() => handleDownloadTxt(result.transcript, "voxa_transcript.txt")}
          >
            <Download size={15} />
            <span>Download TXT</span>
          </button>
        </div>
      </motion.section>

      {/* 2. SIMPLIFIED TEXT CARD */}
      <motion.section
        className="voxa-glass result-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="result-header">
          <div className="result-title-group">
            <div className="result-icon" style={{ color: "#06B6D4" }}>
              <Wand2 size={22} />
            </div>
            <div>
              <h3 className="result-title">Simplified Plain Language</h3>
              <p className="result-subtitle">Accessible English formatted for clarity</p>
            </div>
          </div>
          <div className="result-badges">
            <span className="badge-metric">
              {result.simplification_meta?.original_words || 0} → {result.simplification_meta?.simplified_words || 0} words
            </span>
          </div>
        </div>

        <div className="result-content">{typedText.simplified}</div>

        <div className="result-footer">
          <button
            type="button"
            className={`action-btn ${copiedKey === "simplified" ? "success" : ""}`}
            onClick={() => handleCopy(result.simplified_text, "simplified")}
          >
            {copiedKey === "simplified" ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedKey === "simplified" ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={() => handleDownloadTxt(result.simplified_text, "voxa_simplified.txt")}
          >
            <Download size={15} />
            <span>Download TXT</span>
          </button>
        </div>
      </motion.section>

      {/* 3. EXECUTIVE SUMMARY CARD */}
      <motion.section
        className="voxa-glass result-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="result-header">
          <div className="result-title-group">
            <div className="result-icon" style={{ color: "#22C55E" }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <h3 className="result-title">Executive Summary</h3>
              <p className="result-subtitle">Concise digest for rapid comprehension</p>
            </div>
          </div>
          <div className="result-badges">
            <span className="badge-metric">
              Compression: {Math.round((result.summarization_meta?.compression_ratio || 0.35) * 100)}%
            </span>
          </div>
        </div>

        <div className="result-content">{typedText.summary}</div>

        <div className="result-footer">
          <button
            type="button"
            className={`action-btn ${copiedKey === "summary" ? "success" : ""}`}
            onClick={() => handleCopy(result.summary, "summary")}
          >
            {copiedKey === "summary" ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedKey === "summary" ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={() => handleDownloadTxt(result.summary, "voxa_summary.txt")}
          >
            <Download size={15} />
            <span>Download TXT</span>
          </button>
          <button
            type="button"
            className="action-btn success"
            onClick={handleDownloadJson}
          >
            <Download size={15} />
            <span>Download Full JSON</span>
          </button>
        </div>
      </motion.section>
    </div>
  );
}
