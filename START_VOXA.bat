@echo off
title Voxa AI Platform — Single Unified Runner
cd /d "%~dp0"
echo Starting Voxa AI Platform (Single Server Mode)...
".\.venv\Scripts\python.exe" run_app.py
pause
