# VOXA
🎙️ Voxa AI Platform

Enterprise AI Accessibility Platform for Deaf & Hard-of-Hearing users featuring real-time speech transcription, plain-language simplification, intelligent summarization, live microphone recording, and an interactive React dashboard powered by a Multi-Agent AI architecture.

Features
Live Microphone Recording
Audio File Upload
Multi-Agent AI Pipeline
 High-Accuracy Speech-to-Text (Whisper)
Plain Language Simplification
 AI Executive Summarization
 Arabic & English Speech Support
 FastAPI REST API
 React 19 + Vite Frontend
 Animated Audio Wave Interface
 AI Statistics Dashboard
 TXT & JSON Export
 FFmpeg Audio Normalization
 Anti-Hallucination Guardrails
 Real-Time Processing Pipeline Visualization
 AI Pipeline

The system processes speech through three autonomous AI agents.

Agent 1 — Speech Transcription

Converts live or uploaded audio into accurate text using OpenAI Whisper.

Features:

Speech-to-Text
Language Detection
Audio Normalization
Silence Removal
Confidence Estimation
Agent 2 — Plain Language Simplification

Transforms complex text into accessible, easy-to-read language.

Features:

Accessibility-focused rewriting
Readability optimization
Already-simple detection
Anti-hallucination guardrails
Semantic similarity validation
Agent 3 — Executive Summarization

Extracts the most important information from the transcript.

Features:

Key Point Extraction
Executive Summary
Compression Ratio
Structured Output
System Workflow

The platform follows this processing pipeline:

User records speech or uploads an audio file.
Audio preprocessing & FFmpeg normalization.
Speech transcription using Whisper.
Plain-language simplification.
Executive summarization.
Interactive dashboard visualization.
Export results as TXT or JSON.
Frontend Features

The React interface provides:

Live microphone recording
Drag & Drop audio upload
Animated sound waves
AI pipeline visualization
Live processing indicators
Interactive result cards
Copy to Clipboard
TXT Export
JSON Export
Dark/Light Theme
Responsive Design
Backend Features

FastAPI provides:

Audio processing API
FFmpeg audio normalization
Whisper integration
React static hosting
REST endpoints
Unified production deployment
AI Models

The platform uses multiple AI models working together.

Speech Recognition

OpenAI Whisper (Base)

Used for:

Speech Recognition
Language Detection
Speech-to-Text
Language Simplification

Google FLAN-T5

Used for:

Plain Language Generation
Accessibility Rewriting
Cognitive Simplification
Executive Summarization

DistilBART

Used for:

Text Summarization
Key Takeaway Extraction
Executive Summary Generation
Audio Processing

Audio is normalized before inference using FFmpeg.

Normalization includes:

16 kHz Sample Rate
Mono Channel
16-bit PCM WAV
Silence Removal
Browser Audio Compatibility
Tech Stack
Frontend
React 19
Vite
Tailwind CSS
Framer Motion
Lucide React
Backend
FastAPI
Uvicorn
Python
Artificial Intelligence
OpenAI Whisper
Hugging Face Transformers
FLAN-T5
DistilBART
PyTorch
Scikit-learn
NLTK
Audio
FFmpeg
NumPy
SoundFile
Run
pip install -r requirements.txt

Run the application:

python run_app.py

Or:

python -m uvicorn api.server:app --reload

Open:

http://localhost:8000
API
Health Check
GET /api/health

Returns server status.

Process Audio
POST /api/process-audio

Accepts:

WAV
MP3
M4A
OGG
WebM

Returns:

Transcript
Simplified Text
Executive Summary
Language
Confidence
Statistics
Accessibility

Voxa is designed to improve accessibility for Deaf & Hard-of-Hearing users by converting spoken language into clear, readable, and summarized text.

Future Improvements
Speaker Identification
Real-Time Streaming Transcription
Emotion Detection
Speech Translation
Mobile Application
Cloud Deployment
Multi-Speaker Recognition
Meeting Assistant Mode
Project Architecture
Audio Input
      │
      ▼
FFmpeg Audio Normalization
      │
      ▼
Whisper Speech Recognition
      │
      ▼
FLAN-T5 Simplification
      │
      ▼
DistilBART Summarization
      │
      ▼
FastAPI Backend
      │
      ▼
React Dashboard
