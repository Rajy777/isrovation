# 🌍 CosmicVerse Weather Platform

A comprehensive, intelligent weather monitoring platform for India with satellite imagery, ocean data, and AI-powered chat capabilities.

## ✨ Features

- **🌤️ Weather Forecasts**: 7-day detailed forecasts for 40+ Indian cities
- **🛰️ Satellite Imagery**: Real-time NASA Earth imagery with date selection
- **🌊 Ocean Data**: Wave conditions and marine data for coastal cities
- **🤖 AI Chat Assistant**: Natural language queries powered by OpenRouter (Claude)
- **📊 Interactive Charts**: Temperature trends and precipitation data
- **🗺️ Knowledge Graph**: Explore city relationships and climate zones
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- OpenRouter API key
- NASA API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cosmicverse-weather-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   The `.env` file is already configured with your API keys:
   - OpenRouter API Key: `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`
   - NASA API Key: `3oAT5GOe8AwXQsA1Qd3zLi6wF0HcbzUwbr637Tz8`
   - MongoDB: Configured with your credentials

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will open at `http://localhost:3000`

## 📖 API Documentation

### Weather Endpoints

- `GET /api/weather/:cityname` - Get weather data for a city
- `GET /api/cities` - Get all available cities
- `GET /api/cities/search/:query` - Search cities
- `POST /api/weather/compare` - Compare weather between cities

### Satellite Endpoints

- `GET /api/satellite/:cityname` - Get satellite imagery for a city
- Query parameters: `date` (YYYY-MM-DD format)

### Chat Endpoints

- `POST /api/chat` - Send message to AI assistant
- Body: `{ message: string, conversationHistory?: array }`

### Health Check

- `GET /api/health` - Check API status and features

## 🏗️ Architecture

### Backend Stack
- **Express.js** - Web framework
- **MongoDB** - Database for user data
- **OpenRouter** - AI chat capabilities (Claude)
- **Open-Meteo API** - Weather data
- **NASA Earth Imagery** - Satellite images
- **Node-cache** - Response caching

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 🌟 Key Features Explained

### 1. Weather Data
- **Source**: Open-Meteo API (free, no key required)
- **Coverage**: 40+ major Indian cities
- **Data**: Current conditions, 7-day forecast, hourly data
- **Caching**: 5-minute TTL for optimal performance

### 2. Satellite Imagery
- **Source**: NASA Earth Imagery API
- **Features**: Date selection (last 30 days), zoom/pan capabilities
- **Fallback**: Placeholder images when NASA API is unavailable
- **Caching**: 1-hour TTL to respect rate limits

### 3. Ocean Data
- **Source**: Open-Meteo Marine API
- **Coverage**: 15+ coastal cities
- **Data**: Wave height, period, direction, current velocity
- **Updates**: 10-minute cache for real-time conditions

### 4. AI Chat Assistant
- **Provider**: OpenRouter (Claude 3 Sonnet)
- **Capabilities**: 
  - Weather queries ("weather in Mumbai")
  - City comparisons ("compare Delhi and Chennai")
  - Satellite requests ("satellite view of Bangalore")
  - Ocean data ("waves in Kochi")
- **Context**: Maintains conversation history
- **Fallback**: Rule-based responses when AI is unavailable

### 5. Knowledge Graph
- **Visualization**: Interactive city network
- **Relationships**: Climate zones, proximity (200km radius)
- **Filtering**: By climate zone, search functionality
- **Statistics**: City counts, climate distribution

## 🎯 Usage Examples

### Chat Queries
```
"Weather in Mumbai"
"Compare temperature between Delhi and Chennai"
"Show me satellite image of Bangalore"
"Ocean conditions in Kochi"
"What's the humidity in Pune?"
```

### API Examples
```bash
# Get weather for Mumbai
curl http://localhost:5000/api/weather/mumbai

# Search cities
curl http://localhost:5000/api/cities/search/mum

# Get satellite image
curl http://localhost:5000/api/satellite/delhi?date=2024-01-15

# Chat with AI
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "weather in mumbai"}'
```

## 🔧 Configuration

### Environment Variables
```env
# OpenRouter (AI Chat)
OPENROUTER_API_KEY=your_openrouter_key

# NASA (Satellite Imagery)
NASA_API_KEY=your_nasa_key

# MongoDB (User Data)
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Caching Strategy
- **Weather Data**: 5 minutes (frequently changing)
- **Satellite Images**: 1 hour (NASA rate limits)
- **Ocean Data**: 10 minutes (moderate changes)
- **City Data**: No expiration (static)

## 🚀 Deployment

### Backend (Render.com)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with auto-scaling enabled

### Frontend (Netlify)
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Database (MongoDB Atlas)
- Already configured with your credentials
- Automatic backups enabled
- Global clusters for low latency

## 🔍 Monitoring & Logging

- **Winston** logging with different severity levels
- **Express Rate Limiting** for API protection
- **Helmet** for security headers
- **Error boundaries** in React components
- **Health check** endpoint for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the API health endpoint: `/api/health`
2. Review browser console for frontend errors
3. Check server logs for backend issues
4. Verify API keys are correctly configured

## 🎉 Success Metrics

When fully operational:
- ✅ Weather data loads in <2 seconds
- ✅ Satellite images display within 10 seconds
- ✅ Chat responses in <3 seconds
- ✅ 99.9% uptime with proper monitoring
- ✅ Mobile-responsive across all devices

---

Built with ❤️ for the CosmicVerse Weather Platform