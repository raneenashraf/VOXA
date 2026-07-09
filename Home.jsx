import React, { useState } from "react";
import BackgroundMesh from "../components/BackgroundMesh";
import AccessibilityBar from "../components/AccessibilityBar";
import HeroSection from "../components/HeroSection";
import UploadPanel from "../components/UploadPanel";
import LiveRecordingBar from "../components/LiveRecordingBar";
import PipelineVisualizer from "../components/PipelineVisualizer";
import ResultsShowcase from "../components/ResultsShowcase";
import { processAudioFile } from "../services/api";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

export default function Home() {
  const [status, setStatus] = useState("idle"); // idle, processing, completed, error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const uploadSectionRef = React.useRef(null);

  const recorder = useAudioRecorder();

  const handleScrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleFileSelected = async (file) => {
    setStatus("processing");
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await processAudioFile(file);
      setResult(data);
      setStatus("completed");
    } catch (err) {
      setErrorMessage(err.message || "Failed to process audio.");
      setStatus("error");
    }
  };

  const handleStartRecording = async () => {
    await recorder.startRecording();
  };

  const handleStopRecordingAndProcess = async () => {
    try {
      const { file } = await recorder.stopRecording();
      // Automatically send recorded speech file to POST /api/process
      await handleFileSelected(file);
    } catch (err) {
      // Error is handled inside recorder or displayed via recorder.error
    }
  };

  const effectiveStatus = recorder.isRecording ? "recording" : status;

  return (
    <>
      <BackgroundMesh />

      <div className="app-wrapper">
        <AccessibilityBar />

        <HeroSection
          status={effectiveStatus}
          onStartRecordingClick={handleStartRecording}
          onUploadAudioClick={handleScrollToUpload}
        />

        {/* Live ChatGPT Voice Recording Controller Bar */}
        <LiveRecordingBar
          isRecording={recorder.isRecording}
          formattedTime={recorder.formattedTime}
          error={recorder.error}
          onErrorDismiss={() => recorder.setError(null)}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecordingAndProcess}
          onCancelRecording={recorder.cancelRecording}
          previewUrl={recorder.previewUrl}
          debugDownloadInfo={recorder.debugDownloadInfo}
          isProcessing={status === "processing"}
        />

        <div ref={uploadSectionRef}>
          <UploadPanel
            onFileSelected={handleFileSelected}
            isProcessing={status === "processing" || recorder.isRecording}
          />
        </div>

        {status === "processing" && (
          <PipelineVisualizer isProcessing={true} />
        )}

        {status === "error" && (
          <div
            className="voxa-glass"
            style={{
              padding: "1.5rem",
              borderColor: "#EF4444",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#FCA5A5",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <strong>Processing Error:</strong> {errorMessage}
          </div>
        )}

        {status === "completed" && result && (
          <>
            <PipelineVisualizer isProcessing={false} />
            <ResultsShowcase result={result} />
          </>
        )}
      </div>
    </>
  );
}
