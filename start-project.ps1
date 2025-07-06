# Agri-Lift Soil Insight - PowerShell Startup Script

# Set console colors
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "Green"
Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Agri-Lift Soil Insight Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to check if port is in use
function Test-Port($port) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Function to kill process on port
function Stop-ProcessOnPort($port) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        if ($pid -gt 0) {
            Write-Host "[INFO] Stopping process $pid on port $port..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

try {
    # Check Node.js installation
    Write-Host "[INFO] Checking Node.js installation..." -ForegroundColor Green
    if (-not (Test-Command "node")) {
        Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js version: $nodeVersion" -ForegroundColor Green

    # Check npm installation
    Write-Host "[INFO] Checking npm installation..." -ForegroundColor Green
    if (-not (Test-Command "npm")) {
        Write-Host "[ERROR] npm is not installed or not in PATH" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    $npmVersion = npm --version
    Write-Host "[INFO] npm version: $npmVersion" -ForegroundColor Green

    # Navigate to project directory
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $scriptPath
    Write-Host "[INFO] Project directory: $scriptPath" -ForegroundColor Green

    # Check for port conflicts
    Write-Host "[INFO] Checking for port conflicts..." -ForegroundColor Green
    
    if (Test-Port 8080) {
        Write-Host "[WARNING] Port 8080 is in use. Attempting to free it..." -ForegroundColor Yellow
        Stop-ProcessOnPort 8080
        Start-Sleep -Seconds 2
    }
    
    if (Test-Port 8081) {
        Write-Host "[WARNING] Port 8081 is in use. Attempting to free it..." -ForegroundColor Yellow
        Stop-ProcessOnPort 8081
        Start-Sleep -Seconds 2
    }

    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "[INFO] Installing root dependencies..." -ForegroundColor Green
        npm install
    }

    if (-not (Test-Path "backend\node_modules")) {
        Write-Host "[INFO] Installing backend dependencies..." -ForegroundColor Green
        Set-Location "backend"
        npm install
        Set-Location ".."
    }

    Write-Host ""
    Write-Host "[INFO] Starting the application..." -ForegroundColor Green
    Write-Host "[INFO] Backend will run on: http://localhost:8081" -ForegroundColor Cyan
    Write-Host "[INFO] Frontend will run on: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
    Write-Host ""

    # Start the application
    npm run dev:smart

} catch {
    Write-Host "[ERROR] An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
} finally {
    Write-Host ""
    Write-Host "[INFO] Application stopped." -ForegroundColor Green
    Read-Host "Press Enter to exit"
}
