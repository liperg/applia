@echo off
setlocal
set PORT=8081

echo Checking for process on port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr /i "LISTENING ESCUTANDO"') do (
  echo Killing PID %%a ...
  taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo Starting Expo app (Metro on port %PORT%)...
cd /d "%~dp0app"
npx expo start --port %PORT%
