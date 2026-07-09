import React from "react";
import { motion } from "framer-motion";
import { Mic, FolderUp } from "lucide-react";
import SoundWaveLogo from "./SoundWaveLogo";

export default function HeroSection({ status, onStartRecordingClick, onUploadAudioClick }) {
  return (
    <motion.section
      className="hero-container"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <SoundWaveLogo status={status} />

      <motion.h1
        className="hero-title-main"
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        VOXA
      </motion.h1>

      <h2 className="hero-subtitle">AI Speech Accessibility Platform</h2>

      <p className="hero-tagline">
        Transform Speech into Accessible Intelligence.
      </p>

      <div className="hero-cta-group">
        <button
          type="button"
          className="hero-cta-pill primary"
          onClick={onStartRecordingClick}
        >
          <Mic size={20} />
          <span>Start Recording</span>
        </button>

        <button
          type="button"
          className="hero-cta-pill secondary"
          onClick={onUploadAudioClick}
        >
          <FolderUp size={20} />
          <span>Upload Audio</span>
        </button>
      </div>
    </motion.section>
  );
}
