#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🧪 CosmicVerse Setup Test\n');

// Test 1: Check if all required files exist
console.log('📁 Checking file structure...');
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'backend/.env',
  'frontend/package.json',
  'frontend/src/App.jsx',
  'frontend/src/components/HomePage.jsx',
  'frontend/src/components/CityDashboard.jsx',
  'frontend/src/components/ChatInterface.jsx'
];

let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    filesOk = false;
  }
});

if (!filesOk) {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

// Test 2: Check environment variables
console.log('\n🔑 Checking environment variables...');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'NASA_API_KEY',
  'MONGODB_URI'
];

let envOk = true;
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} - Set`);
  } else {
    console.log(`❌ ${envVar} - NOT SET`);
    envOk = false;
  }
});

if (!envOk) {
  console.log('\n❌ Some environment variables are missing. Please check .env file.');
  process.exit(1);
}

// Test 3: Test API endpoints (if server is running)
async function testAPIs() {
  console.log('\n🌐 Testing API endpoints...');
  
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${baseURL}/health`);
    if (healthResponse.status === 200) {
      console.log('✅ Health endpoint working');
      console.log(`   Features: ${Object.keys(healthResponse.data.features).join(', ')}`);
    }
  } catch (error) {
    console.log('⚠️  Health endpoint not accessible (server may not be running)');
    console.log('   Start server with: cd backend && npm run dev');
  }

  try {
    // Test cities endpoint
    const citiesResponse = await axios.get(`${baseURL}/cities`);
    if (citiesResponse.status === 200) {
      console.log(`✅ Cities endpoint working (${citiesResponse.data.count} cities loaded)`);
    }
  } catch (error) {
    console.log('⚠️  Cities endpoint not accessible');
  }

  try {
    // Test weather endpoint
    const weatherResponse = await axios.get(`${baseURL}/weather/mumbai`);
    if (weatherResponse.status === 200) {
      console.log('✅ Weather endpoint working');
      console.log(`   Mumbai temperature: ${weatherResponse.data.data.weather.current.temperature}°C`);
    }
  } catch (error) {
    console.log('⚠️  Weather endpoint not accessible');
  }
}

// Test 4: Package.json dependencies
console.log('\n📦 Checking package dependencies...');

const backendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json')));
const frontendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json')));

console.log(`✅ Backend dependencies: ${Object.keys(backendPackage.dependencies).length}`);
console.log(`✅ Frontend dependencies: ${Object.keys(frontendPackage.dependencies).length}`);

// Summary
console.log('\n📋 Setup Summary:');
console.log('✅ File structure complete');
console.log('✅ Environment variables configured');
console.log('✅ Dependencies defined');

console.log('\n🚀 Next Steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Start backend: cd backend && npm run dev');
console.log('3. Start frontend: cd frontend && npm run dev');
console.log('4. Visit: http://localhost:3000');

console.log('\n🔗 API Endpoints:');
console.log('- Health: http://localhost:5000/api/health');
console.log('- Weather: http://localhost:5000/api/weather/mumbai');
console.log('- Cities: http://localhost:5000/api/cities');
console.log('- Chat: POST http://localhost:5000/api/chat');

// Run API tests if server might be running
testAPIs().catch(() => {
  console.log('\n💡 Tip: Start the backend server to test API endpoints');
});

console.log('\n🌍 CosmicVerse Weather Platform is ready for launch! 🚀');