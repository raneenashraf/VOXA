import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, X, AlertCircle, Volume2, Download } from "lucide-react";

export default function LiveRecordingBar({
  isRecording,
  formattedTime,
  error,
  onErrorDismiss,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  previewUrl,
  debugDownloadInfo,
  isProcessing,
}) {
  return (
    <div className="live-recording-bar-container" style={{ width: "100%", maxWidth: "780px", margin: "0 auto 1.8rem" }}>
      {/* Elegant Glass Error Card */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="voxa-glass error-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: "1.2rem 1.6rem",
              borderRadius: "16px",
              border: "1.5px solid rgba(239, 68, 68, 0.45)",
              background: "rgba(127, 29, 29, 0.28)",
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <AlertCircle size={22} style={{ color: "#F87171", flexShrink: 0 }} />
              <p style={{ margin: 0, color: "#FEE2E2", fontSize: "0.98rem", fontWeight: 500 }}>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={onErrorDismiss}
              style={{
                background: "transparent",
                border: "none",
                color: "#FCA5A5",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "8px",
              }}
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Recording Controller */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="voxa-glass active-recording-pill"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            style={{
              padding: "1.1rem 1.8rem",
              borderRadius: "999px",
              border: "2px solid #4ADE80",
              boxShadow: "0 0 35px rgba(74, 222, 128, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              background: "radial-gradient(circle, rgba(6, 78, 59, 0.75) 0%, rgba(3, 27, 36, 0.85) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span className="live-recording-dot" />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#4ADE80" }}>
                Recording Live — {formattedTime}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <button
                type="button"
                onClick={onStopRecording}
                disabled={isProcessing}
                className="hero-cta-pill primary"
                style={{ padding: "0.65rem 1.5rem", fontSize: "0.98rem" }}
                aria-label="Stop recording and process audio"
              >
                <Square size={16} fill="#031B24" />
                <span>Stop & Process</span>
              </button>

              <button
                type="button"
                onClick={onCancelRecording}
                disabled={isProcessing}
                style={{
                  background: "rgba(239, 68, 68, 0.18)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#FCA5A5",
                  padding: "0.65rem 1.1rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
                aria-label="Cancel recording"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Preview Player (when recording completed & preview available) */}
      {previewUrl && !isRecording && (
        <motion.div
          className="voxa-glass preview-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "0.9rem 1.4rem",
            borderRadius: "16px",
            border: "1px solid rgba(6, 182, 212, 0.35)",
            background: "rgba(3, 27, 36, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.2rem",
            marginTop: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Volume2 size={18} style={{ color: "#06B6D4" }} />
            <span style={{ fontSize: "0.9rem", color: "#E2E8F0", fontWeight: 600 }}>
              Recorded Speech Preview:
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <audio
              controls
              src={previewUrl}
              style={{ height: "36px", flex: 1, maxWidth: "290px" }}
            />

            {debugDownloadInfo && (
              <a
                href={debugDownloadInfo.url}
                download={debugDownloadInfo.filename}
                className="action-btn"
                style={{
                  textDecoration: "none",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(6, 182, 212, 0.15)",
                  border: "1px solid rgba(6, 182, 212, 0.4)",
                  color: "#22D3EE",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
                title="Download local recording file for ffprobe inspection"
              >
                <Download size={14} />
                <span>Debug Audio</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
