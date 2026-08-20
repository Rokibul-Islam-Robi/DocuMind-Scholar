"""
DocuMind Scholar - Unified Development & Production Runner
Launches FastAPI backend (port 8000) and React frontend (port 3000) concurrently.
"""

import os
import sys
import subprocess
import time
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")


def run_servers():
    print("=" * 65)
    print("🚀 Starting DocuMind Scholar - AI Academic Research Copilot")
    print("=" * 65)

    # 1. Start FastAPI Backend
    print("[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=BASE_DIR
    )

    # 2. Start Vite Frontend
    print("[2/2] Launching Vite React Frontend on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND_DIR
    )

    print("\n" + "✨" * 25)
    print("🎓 DocuMind Scholar is LIVE!")
    print("   👉 Frontend UI: http://localhost:3000")
    print("   👉 Backend API: http://127.0.0.1:8000/docs")
    print("✨" * 25 + "\n")

    time.sleep(2)
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping DocuMind Scholar servers...")
        backend_proc.terminate()
        frontend_proc.terminate()


if __name__ == "__main__":
    run_servers()
