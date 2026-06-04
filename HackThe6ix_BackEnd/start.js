require('dotenv').config();
const { execSync } = require('child_process');
const http = require('http');

async function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

async function startApp() {
  try {
    console.log('🔍 Checking environment...');
    if (!process.env.REACT_APP_SUPABASE_URL) {
      throw new Error('Missing REACT_APP_SUPABASE_URL in .env');
    }

    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('🔍 Checking ports...');
    const port3000Free = await checkPort(3000);
    if (!port3000Free) {
      throw new Error('Port 3000 is in use. Please free it up first.');
    }

    console.log('🚀 Starting development server...');
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Port 3000')) {
      execSync('npx kill-port 3000', { stdio: 'inherit' });
      console.log('🔄 Retrying...');
      startApp();
      return;
    }
    process.exit(1);
  }
}

startApp();
