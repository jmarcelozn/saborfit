@echo off

start "SaborFit Backend" /D "%~dp0backend" cmd /k "npm run dev"

set "WAIT_ATTEMPTS=0"
:wait_backend
powershell -NoProfile -Command "$client = New-Object System.Net.Sockets.TcpClient; $ready = $false; try { $client.Connect('127.0.0.1', 3000); $ready = $true } catch {} finally { $client.Dispose() }; if ($ready) { exit 0 } else { exit 1 }"
if not errorlevel 1 goto start_frontend

set /a WAIT_ATTEMPTS+=1
if %WAIT_ATTEMPTS% GEQ 60 (
  echo ERROR: Backend did not start listening on port 3000 within 60 seconds.
  exit /b 1
)

timeout /t 1 /nobreak >nul
goto wait_backend

:start_frontend
start "SaborFit Frontend" /D "%~dp0frontend" cmd /k "npm run dev"
exit /b 0