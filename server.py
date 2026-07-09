"""
api/server.py
─────────────
FastAPI Backend Server for Voxa AI Platform.
Serves endpoints for React frontend communication without modifying core AI pipeline.
"""

import os
import sys
import tempfile
import time
import json
import subprocess
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

app = FastAPI(
    title="Voxa AI Platform API",
    description="Speech-to-Text Accessibility Pipeline API",
    version="1.0.0",
)

# Enable CORS for local development (React Vite default port 5173 and others)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_orchestrator = None


def get_orchestrator():
    """Lazy load and cache VoxaOrchestrator instance."""
    global _orchestrator
    if _orchestrator is None:
        from core.orchestrator import VoxaOrchestrator
        _orchestrator = VoxaOrchestrator()
    return _orchestrator


def get_audio_info(file_path: str) -> dict:
    """Use ffprobe to inspect audio file metadata."""
    try:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration:stream=codec_name,sample_rate,channels,bits_per_raw_sample",
            "-of", "json", file_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        data = json.loads(res.stdout)
        stream = data.get("streams", [{}])[0] if data.get("streams") else {}
        fmt = data.get("format", {})
        duration_val = fmt.get("duration", "unknown")
        if duration_val != "unknown":
            try:
                duration_val = f"{float(duration_val):.2f}"
            except Exception:
                pass
        return {
            "codec": stream.get("codec_name", "unknown"),
            "sample_rate": str(stream.get("sample_rate", "unknown")),
            "channels": str(stream.get("channels", "unknown")),
            "bit_depth": "16-bit",
            "duration": duration_val,
        }
    except Exception:
        return {
            "codec": "unknown",
            "sample_rate": "unknown",
            "channels": "unknown",
            "bit_depth": "16-bit",
            "duration": "unknown",
        }


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "Voxa AI Platform API",
        "version": "1.0.0",
    }


@app.get("/api/logo")
def get_logo():
    """Serve the VOXA logo image without background."""
    logo_path = os.path.join(PROJECT_ROOT, "voxa without background.png")
    if not os.path.exists(logo_path):
        raise HTTPException(status_code=404, detail="Logo file not found")
    return FileResponse(logo_path, media_type="image/png")


@app.get("/api/sample")
def get_sample_audio():
    """Serve a sample speech WAV file for instant UI demonstration."""
    sample_path = os.path.join(PROJECT_ROOT, "data", "input", "sample.wav")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample audio file not found")
    return FileResponse(sample_path, media_type="audio/wav", filename="sample.wav")


@app.post("/api/process")
async def process_audio(file: UploadFile = File(...)):
    """
    Process uploaded audio file through FFmpeg normalization -> 3-agent Voxa pipeline:
    Stage 1: TranscriptionAgent
    Stage 2: SimplificationAgent
    Stage 3: SummarizationAgent
    """
    if not file:
        raise HTTPException(status_code=400, detail="No audio file uploaded.")

    file_ext = os.path.splitext(file.filename or "audio.webm")[1]
    if not file_ext:
        file_ext = ".webm"

    tmp_file_path = None
    debug_output_dir = os.path.join(PROJECT_ROOT, "data", "output")
    os.makedirs(debug_output_dir, exist_ok=True)
    debug_output_path = os.path.join(debug_output_dir, "debug_output_16k.wav")

    try:
        content = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            tmp.write(content)
            tmp_file_path = tmp.name

        input_info = get_audio_info(tmp_file_path)

        # 1. FFmpeg Normalization & Trailing Silence Removal to 16kHz mono 16-bit PCM WAV
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-i", tmp_file_path,
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-45dB",
            "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le",
            debug_output_path
        ]
        ffmpeg_cmd_str = " ".join(ffmpeg_cmd)

        conv_proc = subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if conv_proc.returncode != 0:
            err_msg = conv_proc.stderr.decode("utf-8", errors="ignore")
            raise RuntimeError(f"FFmpeg audio normalization failed: {err_msg}")

        # 2. Strict ffprobe Post-Conversion Verification
        norm_info = get_audio_info(debug_output_path)
        if norm_info.get("sample_rate") != "16000" or norm_info.get("channels") != "1" or norm_info.get("codec") != "pcm_s16le":
            raise ValueError(
                f"FFmpeg verification failed! Expected Sample Rate=16000, Channels=1, Codec=pcm_s16le. "
                f"Got Sample Rate={norm_info.get('sample_rate')}, Channels={norm_info.get('channels')}, Codec={norm_info.get('codec')}"
            )

        # 3. Process normalized WAV file through Orchestrator
        orchestrator = get_orchestrator()
        result = orchestrator.run(debug_output_path)

        if not result.get("success"):
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": result.get("error", "Unknown error during pipeline processing."),
                },
            )

        # Calculate trimmed duration
        try:
            dur_before_val = float(input_info.get("duration", 0))
            dur_after_val = float(norm_info.get("duration", 0))
            trimmed_secs = max(0.0, dur_before_val - dur_after_val)
            dur_before_str = f"{dur_before_val:.2f}s"
            dur_after_str = f"{dur_after_val:.2f}s"
            trimmed_str = f"{trimmed_secs:.2f}s removed"
        except Exception:
            dur_before_str = f"{input_info.get('duration')}s"
            dur_after_str = f"{norm_info.get('duration')}s"
            trimmed_str = "unknown"

        # 4. Print Structured Terminal Logs as requested
        print("\n" + "=" * 60)
        print("[Voxa Audio Pipeline] Recording Duration & Trailing Silence Trimming:")
        print(f"  - Recording duration before trimming : {dur_before_str}")
        print(f"  - Recording duration after trimming  : {dur_after_str}")
        print(f"  - Trimmed trailing silence           : {trimmed_str}")
        print("↓")
        print("[Voxa Audio Pipeline] FFmpeg Command:")
        print(f"  {ffmpeg_cmd_str}")
        print("↓")
        print("[Voxa Audio Pipeline] Whisper Result:")
        print(f"  - Detected Language : {result.get('transcription_meta', {}).get('language', 'unknown')}")
        print(f"  - Transcript        : {result.get('transcript', '')}")
        print("=" * 60 + "\n")

        return result

    except Exception as exc:
        print(f"\n[Voxa Audio Pipeline] ✗ ERROR: {exc}\n")
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": str(exc),
            },
        )
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.remove(tmp_file_path)
            except Exception:
                pass


# Optional fallback for production single-server mode if dist exists
dist_dir = os.path.join(PROJECT_ROOT, "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")

