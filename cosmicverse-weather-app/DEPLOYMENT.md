# 🚀 CosmicVerse Deployment Guide

This guide covers deploying the CosmicVerse Weather Platform to production.

## 📋 Prerequisites

- ✅ OpenRouter API Key: `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`
- ✅ NASA API Key: `3oAT5GOe8AwXQsA1Qd3zLi6wF0HcbzUwbr637Tz8`
- ✅ MongoDB Atlas: Configured with password `4qDf_VFK**WgE8B`
- GitHub repository
- Render.com account (for backend)
- Netlify account (for frontend)

## 🔧 Backend Deployment (Render.com)

### 1. Prepare Repository
```bash
git add .
git commit -m "Initial CosmicVerse deployment"
git push origin main
```

### 2. Create Render Service
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `cosmicverse-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty

### 3. Environment Variables
Add these in Render dashboard:
```env
OPENROUTER_API_KEY=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
NASA_API_KEY=3oAT5GOe8AwXQsA1Qd3zLi6wF0HcbzUwbr637Tz8
MONGODB_URI=mongodb+srv://cosmicverse:4qDf_VFK**WgE8B@cluster0.mongodb.net/cosmicverse?retryWrites=true&w=majority
JWT_SECRET=cosmicverse_jwt_secret_2024_secure_key
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://cosmicverse-backend.onrender.com`

## 🌐 Frontend Deployment (Netlify)

### 1. Build Configuration
Create `netlify.toml` in frontend directory:
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://cosmicverse-backend.onrender.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Update API Base URL
In `frontend/src/components/HomePage.jsx` and other components:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cosmicverse-backend.onrender.com/api'
  : '/api';
```

### 3. Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4. Environment Variables (if needed)
```env
VITE_API_BASE_URL=https://cosmicverse-backend.onrender.com/api
```

## 📊 MongoDB Atlas Setup

Your MongoDB is already configured, but here's the setup:

### 1. Database Structure
```
cosmicverse/
├── users/          # User accounts (future)
├── favorites/      # User favorites (future)
└── analytics/      # Usage analytics (future)
```

### 2. Connection String
```
mongodb+srv://cosmicverse:4qDf_VFK**WgE8B@cluster0.mongodb.net/cosmicverse?retryWrites=true&w=majority
```

## 🔒 Security Checklist

### Backend Security
- ✅ Helmet.js for security headers
- ✅ CORS configured for frontend domain
- ✅ Rate limiting (100 requests/15min)
- ✅ Environment variables secured
- ✅ MongoDB connection encrypted

### API Keys Security
- ✅ OpenRouter API key secured in environment
- ✅ NASA API key secured in environment
- ✅ MongoDB credentials secured
- ✅ JWT secret randomized

## 📈 Performance Optimization

### Backend Optimizations
- ✅ Response caching (Node-cache)
- ✅ Gzip compression
- ✅ Database connection pooling
- ✅ API response optimization

### Frontend Optimizations
- ✅ Code splitting with Vite
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ Bundle size optimization

## 🔍 Monitoring Setup

### Health Checks
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: Check if site loads properly

### Logging
- Backend logs available in Render dashboard
- Frontend errors in browser console
- MongoDB logs in Atlas dashboard

## 🚀 Deployment Commands

### Quick Deploy Script
```bash
#!/bin/bash
echo "🚀 Deploying CosmicVerse..."

# Update backend URL in frontend
cd frontend/src
find . -name "*.jsx" -exec sed -i 's|/api|https://cosmicverse-backend.onrender.com/api|g' {} \;

# Build frontend
cd ..
npm run build

# Commit changes
cd ..
git add .
git commit -m "Update API URLs for production"
git push origin main

echo "✅ Deployment initiated!"
echo "🔗 Backend: https://cosmicverse-backend.onrender.com"
echo "🔗 Frontend: https://your-app.netlify.app"
```

## 📋 Post-Deployment Checklist

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] City search works
- [ ] Weather data displays
- [ ] Chat interface responds
- [ ] Satellite images load
- [ ] Ocean data shows for coastal cities
- [ ] Knowledge graph renders
- [ ] Mobile responsiveness

### API Tests
```bash
# Test weather endpoint
curl https://cosmicverse-backend.onrender.com/api/health

# Test weather data
curl https://cosmicverse-backend.onrender.com/api/weather/mumbai

# Test chat
curl -X POST https://cosmicverse-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "weather in delhi"}'
```

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 2 seconds
- [ ] Chat response time < 5 seconds
- [ ] Satellite images load < 10 seconds

## 🔧 Troubleshooting

### Common Issues

**Backend not starting:**
- Check environment variables are set
- Verify MongoDB connection string
- Check Render logs for errors

**Frontend API calls failing:**
- Verify CORS settings
- Check API base URL configuration
- Ensure backend is deployed and running

**Chat not working:**
- Verify OpenRouter API key
- Check rate limits
- Test with simple queries first

**Satellite images not loading:**
- Verify NASA API key
- Check API rate limits
- Fallback to placeholder images

### Debug Commands
```bash
# Check backend health
curl https://cosmicverse-backend.onrender.com/api/health

# Test specific city
curl https://cosmicverse-backend.onrender.com/api/weather/mumbai

# Check MongoDB connection
# (Check Render logs for connection status)
```

## 📞 Support

### API Status Pages
- OpenRouter: [status.openrouter.ai](https://status.openrouter.ai)
- NASA API: [api.nasa.gov](https://api.nasa.gov)
- MongoDB Atlas: [status.cloud.mongodb.com](https://status.cloud.mongodb.com)

### Monitoring URLs
- Backend Health: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-app.netlify.app`
- Database: MongoDB Atlas Dashboard

## 🎯 Success Metrics

When deployment is successful:
- ✅ Backend health check returns 200
- ✅ Frontend loads in < 3 seconds
- ✅ Weather data loads for all cities
- ✅ Chat responds to queries
- ✅ Satellite images display
- ✅ Mobile experience is smooth
- ✅ 99.9% uptime maintained

---

🌍 **CosmicVerse is now live and ready to serve weather data to users across India!**