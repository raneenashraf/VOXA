<div align="center">

# 🎙️ Voxa AI Platform
### Next-Generation Accessible Audio Intelligence & Speech Simplification

[![Digital Egypt Pioneers Initiative](https://img.shields.io/badge/DEPI-Generative%20AI%20Track-2563EB?style=for-the-badge)](https://depi.gov.eg/)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React%2019-Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![AI Pipeline](https://img.shields.io/badge/AI%20Pipeline-3--Agent%20Architecture-8A2BE2?style=for-the-badge)](#-ai-pipeline-architecture)

*Empowering Deaf & Hard-of-Hearing Users Through Real-Time Speech Transcription, Cognitive Simplification, and Executive Summarization.*


---

</div>

## 🌟 Overview

**Voxa** is an enterprise-grade AI platform designed to transform spoken audio into accessible, clear, and simplified text. Built for accessibility—specifically aiding deaf and hard-of-hearing individuals—Voxa processes live speech or uploaded audio files through a **Multi-Agent AI Pipeline** that transcribes speech, simplifies complex terminology into plain language, and extracts concise key takeaways.

Featuring a sleek, Apple-inspired **React 19 + Tailwind CSS** frontend powered by a high-performance **FastAPI** backend, Voxa offers seamless one-click web interactions, live microphone recording, and modular command-line interfaces.

---

## ✨ Key Features

- **🎙️ Real-Time Voice Recording & Audio Uploads**: Browser-based live microphone speech capture with automated stream teardown, drag-and-drop audio file upload (`.wav`, `.mp3`, `.m4a`), and instant processing.
- **🤖 3-Agent Autonomous AI Pipeline**:
  - **Agent 1 (Transcription)**: High-accuracy OpenAI Whisper speech-to-text with automated trailing silence removal and FFmpeg audio normalization.
  - **Agent 2 (Simplification)**: Multi-layer readability guardrails, intelligent *"already simple"* detection, strict accessibility-focused prompting, and TF-IDF semantic similarity fallback to ensure clear plain language without hallucinations.
  - **Agent 3 (Summarization)**: Sequence-to-sequence transformer summarization producing structured, bulleted key takeaways.
- **⚡ Modern Full-Stack Architecture**: React 19 UI served dynamically by FastAPI with unified CORS and static asset hosting.
- **🌐 Bilingual Support**: Fully optimized for **English** and **Arabic** speech processing, transcription, and user interface readability.
- **🛠️ One-Click Deployment**: Includes automated Windows batch launchers (`START_VOXA.bat`) for instant local startup.

---

## 🏗️ AI Pipeline Architecture

```
                   ┌─────────────────────────────────────────┐
  Audio Input ───▶ │        Agent 1: Transcription           │  OpenAI Whisper (Audio → Text)
  (Live / File)    └────────────────────┬────────────────────┘
                                        │ High-Accuracy Transcript
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │         Agent 2: Simplification         │  Multi-Layer Guardrails &
                   └────────────────────┬────────────────────┘  Readability Pre-Checks
                                        │ Plain-Language Text
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │         Agent 3: Summarization          │  Transformer Key Takeaways
                   └────────────────────┬────────────────────┘
                                        │ Structured Summary
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │       FastAPI + React 19 Dashboard      │  Interactive UI Showcase & Export
                   └─────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Component | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti |
| **Backend Server** | FastAPI, Uvicorn, Python 3.10+ |
| **AI & ML Core** | PyTorch, OpenAI Whisper, Hugging Face Transformers, NLTK, Scikit-learn |
| **Audio Processing** | FFmpeg, SoundFile, NumPy |

---

## 📂 Project Structure

```text
voxa/
├── api/
│   └── server.py                  # FastAPI Backend API & Unified Static Asset Server
├── frontend/
│   ├── src/                       # React 19 Components, Pages & Audio Recording Hooks
│   ├── package.json               # Frontend Dependencies & Scripts
│   └── tailwind.config.js         # Design System Configuration
├── agents/
│   ├── transcription_agent.py     # Agent 1: Speech-to-Text (OpenAI Whisper)
│   ├── simplification_agent.py    # Agent 2: Cognitive Simplification & Multi-Layer Guardrails
│   └── summarization_agent.py     # Agent 3: Executive Key Takeaways
├── core/
│   └── orchestrator.py            # Synchronous 3-Agent Pipeline Coordinator
├── models/                        # Pretrained & Fine-tuned Model Weights Directory
├── data/
│   ├── input/                     # Audio Upload & Test File Storage
│   └── output/                    # Automated JSON & Text Processing Results
├── config.py                      # Global Pipeline Settings & Model Configurations
├── run_pipeline.py                # Command-Line Interface (CLI) Runner
├── START_VOXA.bat                 # One-Click Windows Application Launcher
└── requirements.txt               # Pinned Python Backend Dependencies
```

---

## ⚡ Quick Start & Installation

### Prerequisites
1. **Python 3.10 or 3.11** installed and added to your system `PATH`.
2. **Node.js (v18+)** installed for frontend building (optional if using the pre-compiled production bundle).
3. **FFmpeg** installed and accessible in your system `PATH`:
   - *Windows (Chocolatey)*: `choco install ffmpeg`
   - *Mac (Homebrew)*: `brew install ffmpeg`
   - *Linux (Ubuntu/Debian)*: `sudo apt update && sudo apt install ffmpeg`

### 1. Clone the Repository & Setup Environment

```bash
git clone https://github.com/YourUsername/voxa.git
cd voxa

# Create & activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt')"
```

### 3. Run the Application

#### Option A: One-Click Launcher (Windows)
Double-click `START_VOXA.bat` or run in terminal:
```cmd
START_VOXA.bat
```
This automatically starts the FastAPI server and serves the React frontend at **`http://localhost:8000`**.

#### Option B: Manual Server Launch
```bash
python -m uvicorn api.server:app --host 0.0.0.0 --port 8000 --reload
```
Open your browser at **`http://localhost:8000`**.

#### Option C: CLI Pipeline Execution
Process an audio file directly from your terminal without the UI:
```bash
python run_pipeline.py data/input/sample.wav --output results.json
```

---

## 🔌 API Reference

The FastAPI backend exposes clean REST endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check ensuring model readiness and server status |
| `/api/process-audio` | `POST` | Accepts audio file upload (`multipart/form-data`) and returns full 3-agent AI results |

---

<div align="right" dir="rtl">

## 🇪🇬 التوثيق باللغة العربية (Arabic Overview)

### نبذة عن مشروع Voxa
منصة **Voxa** هي نظام ذكاء اصطناعي متطور ومبني باستخدام معمارية **الوكلاء المتعددين (Multi-Agent Architecture)**، يهدف إلى تحويل الصوت المسموع إلى نصوص مكتوبة، ومبسطة، ومختصرة لخدمة الصم وضعاف السمع وتسهيل استيعاب المحاضرات والاجتماعات والمحتوى الصوتي باللغتين العربية والإنجليزية.

### الوكلاء الثلاثة (3 AI Agents):
1. **وكيل التفريغ الصوتي (Transcription Agent)**: يعتمد على نموذج **Whisper** لتحويل الصوت التسجيلي أو المباشر إلى نص بدقة عالية مع التخلص التلقائي من الضوضاء وفترات الصمت.
2. **وكيل تبسيط المحتوى (Simplification Agent)**: يقوم بتحويل الجمل المعقدة والمصطلحات الصعبة إلى لغة واضحة وسهلة الفهم (Plain Language) مع ضوابط حماية متعددة الطبقات لمنع أي هلوسة في النص.
3. **وكيل التلخيص (Summarization Agent)**: يستخلص النقاط الأساسية وأهم المخرجات من النص في صورة نقاط واضحة ومباشرة.

### تشغيل المشروع بضغطة زر واحدة (على نظام ويندوز):
يمكنك تشغيل المنصة بالكامل (الواجهة الأمامية React + الخادم FastAPI + النماذج الذكية) بسهولة عبر الضغط المزدوج على ملف:
```cmd
START_VOXA.bat
```
ثم فتح المتصفح على الرابط: `http://localhost:8000`

</div>

---

## 🎓 Acknowledgments & Credits

Developed as part of the **Digital Egypt Pioneers Initiative (DEPI)** — Generative AI Track.

| Task / Module | Ownership |
| :--- | :--- |
| **AI Transcription & Audio Engineering** | Audio Stream Processing & Whisper Pipeline |
| **Cognitive Simplification & NLP Guardrails** | Simplification Agent & Semantic Fallbacks |
| **Executive Summarization Engine** | Transformer Summarization & NLP Chunking |
| **Full-Stack Integration (React 19 + FastAPI)** | Dashboard UI/UX, Live Audio Recording & API Server |

---

<div align="center">
Made with ❤️ by the Voxa DEPI Team
</div>
