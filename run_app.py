"""
run_app.py
──────────
Single Unified Launcher for Voxa AI Platform.
Runs the entire full-stack application from one single command & opens browser automatically.
"""

import os
import sys
import time
import subprocess
import webbrowser
import threading

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

def ensure_frontend_built():
    dist_index = os.path.join(PROJECT_ROOT, "frontend", "dist", "index.html")
    if not os.path.exists(dist_index):
        print(" [Voxa Launcher] Building React frontend for production...")
        frontend_dir = os.path.join(PROJECT_ROOT, "frontend")
        npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
        subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, check=True)
        print(" [Voxa Launcher] ✓ Frontend built successfully!")
    else:
        print(" [Voxa Launcher] ✓ Frontend build detected.")

def open_browser_delayed(url, delay=1.5):
    def _open():
        time.sleep(delay)
        print(f" [Voxa Launcher] Opening browser at {url}")
        webbrowser.open(url)
    t = threading.Thread(target=_open, daemon=True)
    t.start()

def main():
    print("=" * 60)
    print("   🎙️ VOXA AI SPEECH-TO-TEXT ACCESSIBILITY PLATFORM   ")
    print("=" * 60)

    ensure_frontend_built()

    # Determine Python executable
    python_exe = sys.executable

    print("\n [Voxa Launcher] Launching Unified FastAPI & React Server on port 8000...")
    url = "http://127.0.0.1:8000"
    open_browser_delayed(url, delay=1.5)

    try:
        import uvicorn
        uvicorn.run("api.server:app", host="127.0.0.1", port=8000, log_level="info")
    except KeyboardInterrupt:
        print("\n [Voxa Launcher] Shutting down Voxa Server. Goodbye!")

if __name__ == "__main__":
    main()
