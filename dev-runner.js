const { spawn } = require('child_process');
const path = require('path');

console.log('\n============================================================');
console.log('🚀 [POD PLATFORM STARTUP] - Launching 2-Side Dashboard Stack');
console.log('============================================================\n');

// Color helpers
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Start Backend Server
const backend = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true,
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`${GREEN}[BACKEND]:${RESET} ${data.toString()}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`${RED}[BACKEND ERR]:${RESET} ${data.toString()}`);
});

// Start Frontend Server
const frontend = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'pipe',
  shell: true,
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`${CYAN}[FRONTEND]:${RESET} ${data.toString()}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`${YELLOW}[FRONTEND WARN]:${RESET} ${data.toString()}`);
});

// Handle termination
process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
});
