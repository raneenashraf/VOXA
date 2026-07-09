import { useState, useRef, useEffect, useCallback } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordedFile, setRecordedFile] = useState(null);
  const [debugDownloadInfo, setDebugDownloadInfo] = useState(null);

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const cleanupResources = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setError(null);
    setPreviewUrl(null);
    setRecordedFile(null);
    setDebugDownloadInfo(null);
    audioChunksRef.current = [];
    setElapsedSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "",
      ].find((type) => !type || MediaRecorder.isTypeSupported(type));

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start(100);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      cleanupResources();
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No microphone detected. Please connect a microphone and try again.");
      } else {
        setError(err.message || "Could not start microphone recording.");
      }
    }
  };

  const stopRecording = () => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        cleanupResources();
        setIsRecording(false);
        return reject(new Error("No active recording found."));
      }

      // Immediately stop mic stream tracks so no extra trailing silence is buffered
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      recorder.onstop = async () => {
        const duration = elapsedSeconds;
        const stream = mediaStreamRef.current;

        // Try getting track settings for detailed log
        let trackSampleRate = "unknown";
        let trackChannels = "unknown";
        if (stream) {
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0 && audioTracks[0].getSettings) {
            const settings = audioTracks[0].getSettings();
            if (settings.sampleRate) trackSampleRate = `${settings.sampleRate} Hz`;
            if (settings.channelCount) trackChannels = `${settings.channelCount}`;
          }
        }

        cleanupResources();
        setIsRecording(false);

        if (duration < 1 && audioChunksRef.current.length < 5) {
          const shortErr = "Recording is too short (less than 1 second). Please speak clearly for at least 1-2 seconds.";
          setError(shortErr);
          return reject(new Error(shortErr));
        }

        const finalMimeType = recorder.mimeType || "audio/webm";
        const rawBlob = new Blob(audioChunksRef.current, { type: finalMimeType });

        if (rawBlob.size === 0) {
          const emptyErr = "Recording captured empty audio. Please check your microphone.";
          setError(emptyErr);
          return reject(new Error(emptyErr));
        }

        // Determine extension from MIME type
        let ext = "webm";
        if (finalMimeType.includes("mp4") || finalMimeType.includes("m4a")) ext = "mp4";
        else if (finalMimeType.includes("ogg")) ext = "ogg";
        else if (finalMimeType.includes("wav")) ext = "wav";

        const filename = `voxa_live_speech_${Date.now()}.${ext}`;
        const debugFilename = `debug_recording.${ext}`;
        const nativeFile = new File([rawBlob], filename, { type: finalMimeType });
        const url = URL.createObjectURL(rawBlob);

        // Structured Console Log as requested
        console.log("==========================================");
        console.log("[Voxa React Audio Recorder] Recording Stopped:");
        console.log(`- Duration    : ${duration}s`);
        console.log(`- Sample Rate : ${trackSampleRate}`);
        console.log(`- Channels    : ${trackChannels}`);
        console.log(`- MIME Type   : ${finalMimeType}`);
        console.log(`- File Size   : ${rawBlob.size} bytes (${(rawBlob.size / 1024).toFixed(2)} KB)`);
        console.log("==========================================");

        setPreviewUrl(url);
        setRecordedFile(nativeFile);
        setDebugDownloadInfo({ url, filename: debugFilename });

        resolve({ file: nativeFile, url, duration });
      };

      recorder.stop();
    });
  };

  const cancelRecording = () => {
    cleanupResources();
    setIsRecording(false);
    setElapsedSeconds(0);
    audioChunksRef.current = [];
    setError(null);
  };

  const resetRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setRecordedFile(null);
    setDebugDownloadInfo(null);
    setError(null);
    setElapsedSeconds(0);
  };

  return {
    isRecording,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    error,
    setError,
    previewUrl,
    recordedFile,
    debugDownloadInfo,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  };
}

