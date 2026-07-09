import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Cpu, Wand2, FileText, CheckCircle2 } from "lucide-react";

const STAGES = [
  { id: 1, label: "Voice Input", desc: "Audio Ingest", icon: Mic },
  { id: 2, label: "Whisper AI", desc: "Speech to Text", icon: Cpu },
  { id: 3, label: "Simplification", desc: "Plain Language", icon: Wand2 },
  { id: 4, label: "Summary", desc: "Executive Digest", icon: FileText },
  { id: 5, label: "Results", desc: "Accessible Ready", icon: CheckCircle2 },
];

export default function PipelineVisualizer({ isProcessing }) {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    if (!isProcessing) {
      setActiveStage(5);
      return;
    }

    setActiveStage(1);
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <motion.section
      className="voxa-glass pipeline-visualizer"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pipeline-title">
        <Cpu size={20} />
        <span>Live AI Accessibility Pipeline</span>
      </div>

      <div className="pipeline-stages">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = isProcessing && activeStage === stage.id;
          const isCompleted = (!isProcessing && activeStage === 5) || stage.id < activeStage;

          return (
            <motion.div
              key={stage.id}
              className={`stage-card ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              whileHover={{ y: -3 }}
            >
              <div className="stage-number">Step 0{stage.id}</div>
              <div style={{ margin: "0.4rem 0", color: isActive ? "#4ADE80" : isCompleted ? "#06B6D4" : "#94A3B8" }}>
                <Icon size={24} />
              </div>
              <div className="stage-name">{stage.label}</div>
              <div className="stage-desc">{stage.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
