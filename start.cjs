#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const net = require('net');
const fs = require('fs');

console.log('🚀 Starting Agri-Lift Full Stack Application...\n');

// Check if dependencies are installed
function checkDependencies() {
  const rootNodeModules = path.join(__dirname, 'node_modules');
  const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');

  if (!fs.existsSync(rootNodeModules)) {
    console.log('📦 Installing root dependencies...');
    exec('npm install', { cwd: __dirname }, (error) => {
      if (error) {
        console.error('❌ Failed to install root dependencies:', error);
        process.exit(1);
      }
    });
  }

  if (!fs.existsSync(backendNodeModules)) {
    console.log('📦 Installing backend dependencies...');
    exec('npm install', { cwd: path.join(__dirname, 'backend') }, (error) => {
      if (error) {
        console.error('❌ Failed to install backend dependencies:', error);
        process.exit(1);
      }
    });
  }
}

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

// Function to spawn a process with proper output handling
function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  });

  child.on('error', (error) => {
    console.error(`Error starting ${command}:`, error);
  });

  return child;
}

// Function to kill processes on specific ports (Windows)
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) {
            const pid = match[1];
            exec(`taskkill /PID ${pid} /F`, () => {});
          }
        });
      }
      setTimeout(resolve, 1000); // Wait a bit for processes to be killed
    });
  });
}

async function startServers() {
  // Check dependencies first
  console.log('📦 Checking dependencies...');
  checkDependencies();

  // Check and handle port conflicts
  console.log('🔍 Checking for port conflicts...');

  const backendPortAvailable = await isPortAvailable(8081);
  const frontendPortAvailable = await isPortAvailable(8080);

  if (!backendPortAvailable) {
    console.log('⚠️  Port 8081 is in use. Attempting to free it...');
    await killProcessOnPort(8081);
  }

  if (!frontendPortAvailable) {
    console.log('⚠️  Port 8080 is in use. Attempting to free it...');
    await killProcessOnPort(8080);
  }

  // Start backend
  console.log('📡 Starting Backend Server on port 8081...');
  const backend = spawnProcess('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend')
  });

  // Wait a bit for backend to start, then start frontend
  setTimeout(() => {
    console.log('🌐 Starting Frontend Development Server on port 8080...');
    const frontend = spawnProcess('npm', ['run', 'dev:frontend-only']);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
      process.exit(0);
    });
  }, 3000);

  console.log('\n✅ Both servers are starting up!');
  console.log('📡 Backend will be available at: http://localhost:8081');
  console.log('🌐 Frontend will be available at: http://localhost:8080');
  console.log('\n💡 Press Ctrl+C to stop both servers\n');
}

startServers().catch(console.error);
