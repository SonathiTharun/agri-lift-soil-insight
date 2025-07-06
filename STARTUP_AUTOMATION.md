# 🚀 Agri-Lift Startup Automation

This document explains all the automated startup options available for the Agri-Lift Soil Insight project.

## 🎯 Quick Start Options

### Option 1: Double-Click Batch File (Recommended)
Simply double-click `start-project.bat` to start the entire application.

### Option 2: PowerShell Script
Run `start-project.ps1` for a more advanced startup with better error handling.

### Option 3: Quick Command
Double-click `quick-start.cmd` for the fastest startup (minimal output).

### Option 4: Desktop Shortcut
1. Run `create-desktop-shortcut.ps1` once to create a desktop shortcut
2. Double-click the shortcut on your desktop anytime

### Option 5: VS Code Integration
1. Open `agri-lift.code-workspace` in VS Code
2. Press `Ctrl+Shift+P` and type "Tasks: Run Task"
3. Select "Start Full Application"

### Option 6: Command Line
```bash
npm run dev:smart
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `start-project.bat` | Windows batch file with dependency checking |
| `start-project.ps1` | PowerShell script with advanced features |
| `quick-start.cmd` | Minimal startup command |
| `agri-lift.code-workspace` | VS Code workspace configuration |
| `create-desktop-shortcut.ps1` | Creates desktop shortcut |
| `start.cjs` | Node.js startup script (improved) |

## 🔧 What Each Script Does

### Automatic Features:
- ✅ Checks for Node.js and npm installation
- ✅ Installs dependencies if missing
- ✅ Checks for port conflicts (8080, 8081)
- ✅ Kills conflicting processes automatically
- ✅ Starts backend server (port 8081)
- ✅ Starts frontend development server (port 8080)
- ✅ Provides clear status messages
- ✅ Handles graceful shutdown with Ctrl+C

### Port Configuration:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8081

## 🛠️ Troubleshooting

### If ports are still in use:
1. Close all Node.js processes in Task Manager
2. Run the startup script again

### If dependencies fail to install:
1. Delete `node_modules` folders
2. Run `npm install` manually in root and backend directories
3. Try the startup script again

### PowerShell Execution Policy Error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎨 VS Code Integration Features

The workspace configuration includes:
- **Tasks**: Pre-configured build and start tasks
- **Debug**: Backend debugging configuration
- **Settings**: Optimized for the project structure
- **Extensions**: Recommended extensions for development

## 📝 Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:smart` | Smart startup with port management |
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend-only` | Frontend only |
| `npm run dev:backend` | Backend only |

## 🔄 Next Steps

After running any startup script:
1. Wait for both servers to start (usually 10-30 seconds)
2. Open http://localhost:8080 in your browser
3. The application will automatically connect to the backend

## 💡 Tips

- **First time setup**: Use `start-project.bat` for dependency installation
- **Daily development**: Use `quick-start.cmd` for fastest startup
- **VS Code users**: Use the workspace file for integrated development
- **Desktop users**: Create a shortcut for one-click access

## 🚫 What You No Longer Need to Do

❌ `cd backend`  
❌ `node server.js`  
❌ `npm run dev`  
❌ Manual port checking  
❌ Manual dependency installation  

✅ Just double-click and go!
