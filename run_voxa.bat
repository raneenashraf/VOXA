@echo off
title Voxa AI Platform Launcher
echo ========================================================
echo   🎙️ Starting Voxa AI Speech-to-Text Platform
echo ========================================================

echo [1/2] Launching FastAPI Backend Server (Port 8000)...
start "Voxa AI Backend Server (FastAPI)" cmd /k "d:\Projects\voxa\.venv\Scripts\python.exe -m uvicorn api.server:app --host localhost --port 8000"

echo [2/2] Launching React Frontend Dev Server (Port 5173)...
cd frontend
start "Voxa AI Frontend (React + Vite)" cmd /k "npm run dev"

echo ========================================================
echo   ✓ Servers launched!
echo   Open your browser at: http://localhost:5173
echo ========================================================
pause
