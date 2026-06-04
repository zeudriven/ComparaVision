const { execSync } = require('child_process');

try {
  // Kill processes on Windows
  if (process.platform === 'win32') {
    execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
  } else {
    // Kill processes on Unix-based systems
    execSync('pkill -f node', { stdio: 'inherit' });
  }
  console.log('All Node.js processes stopped successfully');
} catch (error) {
  console.log('No active Node.js processes found');
}
