# 🚀 Agri-Lift Development Guide

## Quick Start Commands

### **Automatic Frontend + Backend Startup**

Now you can start both frontend and backend servers with a single command!

#### **Option 1: Simple Parallel Start (Recommended)**
```bash
npm run dev
```
This will start:
- 🌐 **Frontend**: http://localhost:3000 (or next available port)
- 📡 **Backend**: http://localhost:5001

#### **Option 2: Smart Start with Port Management**
```bash
npm run dev:smart
```
This will:
- 🔍 Check for port conflicts
- ⚠️ Automatically free up ports if needed
- 📡 Start backend on port 5001
- 🌐 Start frontend on port 3000
- 💡 Handle graceful shutdown with Ctrl+C

#### **Individual Server Commands**
```bash
# Frontend only
npm run dev:frontend-only

# Backend only
npm run dev:backend

# Frontend with specific port
npm run dev:frontend
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start both frontend and backend |
| `npm run dev:smart` | 🧠 Smart start with port management |
| `npm run dev:frontend` | 🌐 Start frontend on port 3000 |
| `npm run dev:backend` | 📡 Start backend on port 5001 |
| `npm run dev:frontend-only` | 🌐 Start only frontend |
| `npm run build` | 🏗️ Build for production |
| `npm run preview` | 👀 Preview production build |

## 🔧 Port Configuration

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **Database**: MongoDB Atlas (configured in backend/.env)

## 🛠️ Development Workflow

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Access Applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api
   - Checkout: http://localhost:3000/checkout

3. **Stop Servers**:
   - Press `Ctrl+C` in the terminal

## 🚨 Troubleshooting

### Port Already in Use
If you get port conflicts:
1. Use `npm run dev:smart` for automatic port management
2. Or manually kill processes:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   netstat -ano | findstr :5001
   taskkill /PID <PID> /F
   ```

### Backend Connection Issues
- Ensure MongoDB connection string is correct in `backend/.env`
- Check if backend is running on http://localhost:5001

### Frontend Build Issues
- Clear node_modules and reinstall: `npm install`
- Check for TypeScript errors: `npm run type-check`

## 📁 Project Structure

```
agri-lift-soil-insight/
├── src/                    # Frontend source
│   ├── pages/
│   │   └── Checkout.tsx   # Fixed checkout page
│   ├── context/
│   │   └── cartcontext.tsx # Cart management
│   └── ...
├── backend/               # Backend source
│   ├── server.js         # Main server file
│   └── ...
├── start.cjs             # Smart startup script
└── package.json          # Main package file
```

## ✅ Recent Fixes

- ✅ Fixed blank screen issue in checkout
- ✅ Resolved import path case sensitivity
- ✅ Added automatic frontend + backend startup
- ✅ Implemented smart port management
- ✅ Fixed TypeScript compilation errors

## 🎯 Next Steps

1. Test the checkout flow: http://localhost:3000/checkout
2. Add items to cart and test payment processing
3. Verify both frontend and backend are working together

---

**Happy Coding! 🌱**
