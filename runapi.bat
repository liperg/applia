@echo off
setlocal
set PORT=8000

echo Checking for process on port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr /i "LISTENING ESCUTANDO"') do (
  echo Killing PID %%a ...
  taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo Starting API on port %PORT%...
cd /d "%~dp0api"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port %PORT%
