const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize cache (5 minutes TTL for weather data)
const cache = new NodeCache({ stdTTL: 300 });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📊 MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Indian Cities Database
const indianCities = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, coastal: true },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lon: 77.1025, coastal: false },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946, coastal: false },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, coastal: false },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, coastal: true },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, coastal: true },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, coastal: false },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, coastal: false },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, coastal: false },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311, coastal: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, coastal: false },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319, coastal: false },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, coastal: false },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, coastal: false },
  { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lon: 72.9781, coastal: true },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, coastal: false },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, coastal: true },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', lat: 18.6298, lon: 73.7997, coastal: false },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, coastal: false },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lon: 73.1812, coastal: false },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lon: 77.4538, coastal: false },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, coastal: false },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081, coastal: false },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, coastal: false },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lon: 77.3178, coastal: false },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064, coastal: false },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, coastal: false },
  { name: 'Kalyan-Dombivli', state: 'Maharashtra', lat: 19.2403, lon: 73.1305, coastal: true },
  { name: 'Vasai-Virar', state: 'Maharashtra', lat: 19.4912, lon: 72.8054, coastal: true },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, coastal: false },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673, coastal: true },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, coastal: false },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, coastal: false },
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lon: 76.7794, coastal: false },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362, coastal: false },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lon: 76.9366, coastal: true },
  { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lon: 74.8560, coastal: true },
  { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lon: 79.8083, coastal: true },
  { name: 'Goa', state: 'Goa', lat: 15.2993, lon: 74.1240, coastal: true },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lon: 85.8245, coastal: false }
];

// OpenRouter Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// NASA API Configuration
const NASA_API_KEY = process.env.NASA_API_KEY;

// Weather API Functions
async function getWeatherData(lat, lon) {
  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max',
        hourly: 'temperature_2m,precipitation_probability',
        timezone: 'Asia/Kolkata',
        forecast_days: 7
      }
    });

    return {
      current: {
        temperature: Math.round(response.data.current.temperature_2m),
        feelsLike: Math.round(response.data.current.apparent_temperature),
        humidity: response.data.current.relative_humidity_2m,
        windSpeed: Math.round(response.data.current.wind_speed_10m),
        weatherCode: response.data.current.weather_code
      },
      daily: response.data.daily.temperature_2m_max.map((maxTemp, index) => ({
        date: response.data.daily.time[index],
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(response.data.daily.temperature_2m_min[index]),
        precipitation: response.data.daily.precipitation_sum[index],
        weatherCode: response.data.daily.weather_code[index],
        windSpeed: Math.round(response.data.daily.wind_speed_10m_max[index])
      })),
      hourly: response.data.hourly.temperature_2m.slice(0, 24).map((temp, index) => ({
        time: response.data.hourly.time[index],
        temperature: Math.round(temp),
        precipitation: response.data.hourly.precipitation_probability[index]
      }))
    };
  } catch (error) {
    console.error('Weather API Error:', error.message);
    throw new Error('Failed to fetch weather data');
  }
}

// Ocean Data for Coastal Cities
async function getOceanData(lat, lon) {
  try {
    const response = await axios.get(`https://marine-api.open-meteo.com/v1/marine`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'wave_height,wave_direction,wave_period,ocean_current_velocity',
        daily: 'wave_height_max,wave_direction_dominant',
        timezone: 'Asia/Kolkata',
        forecast_days: 3
      }
    });

    return {
      current: {
        waveHeight: response.data.current.wave_height,
        waveDirection: response.data.current.wave_direction,
        wavePeriod: response.data.current.wave_period,
        currentVelocity: response.data.current.ocean_current_velocity
      },
      daily: response.data.daily.wave_height_max.map((maxWave, index) => ({
        date: response.data.daily.time[index],
        maxWaveHeight: maxWave,
        dominantDirection: response.data.daily.wave_direction_dominant[index]
      }))
    };
  } catch (error) {
    console.error('Ocean API Error:', error.message);
    return null;
  }
}

// NASA Satellite Imagery
async function getSatelliteImagery(lat, lon, date = null) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const response = await axios.get(`https://api.nasa.gov/planetary/earth/imagery`, {
      params: {
        lon: lon,
        lat: lat,
        date: targetDate,
        dim: 0.15,
        api_key: NASA_API_KEY
      }
    });

    return {
      imageUrl: response.request.responseURL,
      date: targetDate,
      coordinates: { lat, lon },
      source: 'NASA Earth Imagery'
    };
  } catch (error) {
    console.error('NASA API Error:', error.message);
    // Return placeholder if NASA API fails
    return {
      imageUrl: `https://via.placeholder.com/400x400/1e40af/ffffff?text=Satellite+Image+Unavailable`,
      date: date || new Date().toISOString().split('T')[0],
      coordinates: { lat, lon },
      source: 'Placeholder',
      error: 'NASA API temporarily unavailable'
    };
  }
}

// OpenRouter Chat Function
async function getChatResponse(messages) {
  try {
    const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
      model: 'anthropic/claude-3-sonnet',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cosmicverse.app',
        'X-Title': 'CosmicVerse Weather Platform'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error('Failed to get chat response');
  }
}

// Intent Recognition Function
function recognizeIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  // Weather intent
  if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
    const cityMatch = indianCities.find(city => 
      lowerMessage.includes(city.name.toLowerCase())
    );
    
    return {
      intent: 'get_weather',
      city: cityMatch ? cityMatch.name : null,
      confidence: cityMatch ? 0.9 : 0.7
    };
  }
  
  // Compare cities intent
  if (lowerMessage.includes('compare') && (lowerMessage.includes('weather') || lowerMessage.includes('temperature'))) {
    const cities = indianCities.filter(city => 
      lowerMessage.includes(city.name.toLowerCase())
    );
    
    return {
      intent: 'compare_weather',
      cities: cities.map(c => c.name),
      confidence: cities.length >= 2 ? 0.9 : 0.6
    };
  }
  
  // Satellite intent
  if (lowerMessage.includes('satellite') || lowerMessage.includes('image') || lowerMessage.includes('view from space')) {
    const cityMatch = indianCities.find(city => 
      lowerMessage.includes(city.name.toLowerCase())
    );
    
    return {
      intent: 'get_satellite',
      city: cityMatch ? cityMatch.name : null,
      confidence: 0.8
    };
  }
  
  // Ocean data intent
  if (lowerMessage.includes('ocean') || lowerMessage.includes('wave') || lowerMessage.includes('sea')) {
    const cityMatch = indianCities.find(city => 
      lowerMessage.includes(city.name.toLowerCase())
    );
    
    return {
      intent: 'get_ocean',
      city: cityMatch ? cityMatch.name : null,
      confidence: 0.8
    };
  }
  
  return {
    intent: 'general_chat',
    confidence: 0.5
  };
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 CosmicVerse Backend running successfully',
    timestamp: new Date().toISOString(),
    features: {
      weather: 'Open-Meteo API',
      ocean: 'Marine API',
      satellite: 'NASA Earth Imagery',
      chat: 'OpenRouter (Claude)',
      cities: `${indianCities.length} Indian cities`,
      database: 'MongoDB Atlas'
    }
  });
});

// Get weather for specific city
app.get('/api/weather/:cityname', async (req, res) => {
  try {
    const cityName = req.params.cityname;
    const cacheKey = `weather_${cityName.toLowerCase()}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true,
        city: cityName
      });
    }
    
    // Find city in database
    const city = indianCities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found',
        suggestions: indianCities
          .filter(c => c.name.toLowerCase().includes(cityName.toLowerCase().substring(0, 3)))
          .slice(0, 5)
          .map(c => c.name)
      });
    }
    
    // Fetch weather data
    const weatherData = await getWeatherData(city.lat, city.lon);
    
    // Fetch ocean data for coastal cities
    let oceanData = null;
    if (city.coastal) {
      oceanData = await getOceanData(city.lat, city.lon);
    }
    
    const result = {
      weather: weatherData,
      ocean: oceanData,
      city: {
        name: city.name,
        state: city.state,
        coordinates: { lat: city.lat, lon: city.lon },
        coastal: city.coastal
      }
    };
    
    // Cache the result
    cache.set(cacheKey, result);
    
    res.json({
      success: true,
      data: result,
      cached: false
    });
    
  } catch (error) {
    console.error('Weather endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

// Get satellite imagery for city
app.get('/api/satellite/:cityname', async (req, res) => {
  try {
    const cityName = req.params.cityname;
    const date = req.query.date;
    const cacheKey = `satellite_${cityName.toLowerCase()}_${date || 'latest'}`;
    
    // Check cache first (1 hour TTL for satellite images)
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }
    
    const city = indianCities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }
    
    const satelliteData = await getSatelliteImagery(city.lat, city.lon, date);
    
    // Cache for 1 hour
    cache.set(cacheKey, satelliteData, 3600);
    
    res.json({
      success: true,
      data: satelliteData,
      cached: false
    });
    
  } catch (error) {
    console.error('Satellite endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch satellite data',
      message: error.message
    });
  }
});

// Search cities
app.get('/api/cities/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const matchingCities = indianCities.filter(city =>
      city.name.toLowerCase().includes(query) ||
      city.state.toLowerCase().includes(query)
    );
    
    res.json({
      success: true,
      data: matchingCities.slice(0, 10),
      count: matchingCities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search cities'
    });
  }
});

// Compare weather between cities
app.post('/api/weather/compare', async (req, res) => {
  try {
    const { cities } = req.body;
    
    if (!cities || cities.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 cities required for comparison'
      });
    }
    
    const weatherPromises = cities.map(async (cityName) => {
      const city = indianCities.find(c => 
        c.name.toLowerCase() === cityName.toLowerCase()
      );
      
      if (!city) {
        throw new Error(`City ${cityName} not found`);
      }
      
      const weatherData = await getWeatherData(city.lat, city.lon);
      return {
        city: city.name,
        weather: weatherData.current
      };
    });
    
    const results = await Promise.all(weatherPromises);
    
    res.json({
      success: true,
      data: {
        comparison: results,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Weather comparison error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to compare weather data',
      message: error.message
    });
  }
});

// Chat endpoint with intent recognition
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Recognize intent
    const intent = recognizeIntent(message);
    
    let response = '';
    let actionData = null;
    
    if (intent.intent === 'get_weather' && intent.city) {
      // Handle weather request
      const city = indianCities.find(c => 
        c.name.toLowerCase() === intent.city.toLowerCase()
      );
      
      if (city) {
        try {
          const weatherData = await getWeatherData(city.lat, city.lon);
          actionData = { type: 'weather', city: city.name, data: weatherData };
          response = `Here's the current weather for ${city.name}: ${weatherData.current.temperature}°C (feels like ${weatherData.current.feelsLike}°C) with ${weatherData.current.humidity}% humidity. Wind speed is ${weatherData.current.windSpeed} km/h.`;
        } catch (error) {
          response = `Sorry, I couldn't fetch the weather data for ${city.name} right now. Please try again later.`;
        }
      }
    } else if (intent.intent === 'compare_weather' && intent.cities.length >= 2) {
      // Handle weather comparison
      try {
        const weatherPromises = intent.cities.slice(0, 2).map(async (cityName) => {
          const city = indianCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
          const weatherData = await getWeatherData(city.lat, city.lon);
          return { city: city.name, weather: weatherData.current };
        });
        
        const results = await Promise.all(weatherPromises);
        actionData = { type: 'comparison', data: results };
        
        const city1 = results[0];
        const city2 = results[1];
        const tempDiff = city1.weather.temperature - city2.weather.temperature;
        const humidityDiff = city1.weather.humidity - city2.weather.humidity;
        
        response = `Weather comparison: ${city1.city} is ${city1.weather.temperature}°C with ${city1.weather.humidity}% humidity, while ${city2.city} is ${city2.weather.temperature}°C with ${city2.weather.humidity}% humidity. ${city1.city} is ${Math.abs(tempDiff)}°C ${tempDiff > 0 ? 'warmer' : 'cooler'} and ${Math.abs(humidityDiff)}% ${humidityDiff > 0 ? 'more humid' : 'less humid'}.`;
      } catch (error) {
        response = `Sorry, I couldn't compare the weather data right now. Please try again later.`;
      }
    } else if (intent.intent === 'get_satellite' && intent.city) {
      // Handle satellite imagery request
      const city = indianCities.find(c => 
        c.name.toLowerCase() === intent.city.toLowerCase()
      );
      
      if (city) {
        try {
          const satelliteData = await getSatelliteImagery(city.lat, city.lon);
          actionData = { type: 'satellite', city: city.name, data: satelliteData };
          response = `Here's the latest satellite image for ${city.name}. The image was captured on ${satelliteData.date} from NASA Earth Imagery.`;
        } catch (error) {
          response = `Sorry, I couldn't fetch the satellite image for ${city.name} right now.`;
        }
      }
    } else if (intent.intent === 'get_ocean' && intent.city) {
      // Handle ocean data request
      const city = indianCities.find(c => 
        c.name.toLowerCase() === intent.city.toLowerCase()
      );
      
      if (city && city.coastal) {
        try {
          const oceanData = await getOceanData(city.lat, city.lon);
          if (oceanData) {
            actionData = { type: 'ocean', city: city.name, data: oceanData };
            response = `Ocean conditions near ${city.name}: Wave height is ${oceanData.current.waveHeight}m with a period of ${oceanData.current.wavePeriod}s. Ocean current velocity is ${oceanData.current.currentVelocity} m/s.`;
          } else {
            response = `Sorry, I couldn't fetch ocean data for ${city.name} right now.`;
          }
        } catch (error) {
          response = `Sorry, I couldn't fetch ocean data for ${city.name} right now.`;
        }
      } else if (city && !city.coastal) {
        response = `${city.name} is not a coastal city, so ocean data is not available.`;
      } else {
        response = `I couldn't find the city "${intent.city}". Try asking about coastal cities like Mumbai, Chennai, or Kolkata.`;
      }
    } else {
      // Use OpenRouter for general chat or fallback
      const messages = [
        {
          role: 'system',
          content: 'You are CosmicVerse AI, a helpful weather assistant for Indian cities. You can provide weather information, satellite imagery details, and ocean data for coastal cities. Keep responses concise and weather-focused. If users ask about weather in specific cities, guide them to use commands like "weather in Mumbai" or "compare Delhi and Mumbai weather".'
        },
        ...conversationHistory.slice(-5), // Last 5 messages for context
        {
          role: 'user',
          content: message
        }
      ];
      
      try {
        response = await getChatResponse(messages);
      } catch (error) {
        response = "I'm having trouble connecting to my AI service right now. Please try asking about weather in specific Indian cities like 'weather in Mumbai' or 'compare Delhi and Chennai weather'!";
      }
    }
    
    res.json({
      success: true,
      data: {
        response,
        intent: intent.intent,
        actionData,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      message: error.message
    });
  }
});

// Get all cities
app.get('/api/cities', (req, res) => {
  res.json({
    success: true,
    data: indianCities,
    count: indianCities.length
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CosmicVerse Backend running on http://localhost:${PORT}`);
  console.log(`📡 Weather API: Open-Meteo`);
  console.log(`🌊 Ocean API: Marine Open-Meteo`);
  console.log(`🛰️  Satellite API: NASA Earth Imagery`);
  console.log(`🤖 AI Chat: OpenRouter (Claude)`);
  console.log(`🏙️  Cities: ${indianCities.length} Indian cities loaded`);
  console.log(`📊 Database: MongoDB Atlas`);
});

module.exports = app;