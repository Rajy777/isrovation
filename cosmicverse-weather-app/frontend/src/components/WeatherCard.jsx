import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Cloud, 
  CloudRain,
  CloudSnow,
  Zap
} from 'lucide-react';

const WeatherCard = ({ weather, city }) => {
  const getWeatherIcon = (code) => {
    const iconMap = {
      0: Sun,        // Clear sky
      1: Sun,        // Mainly clear
      2: Cloud,      // Partly cloudy
      3: Cloud,      // Overcast
      45: Cloud,     // Foggy
      48: Cloud,     // Depositing rime fog
      51: CloudRain, // Light drizzle
      53: CloudRain, // Moderate drizzle
      55: CloudRain, // Dense drizzle
      61: CloudRain, // Slight rain
      63: CloudRain, // Moderate rain
      65: CloudRain, // Heavy rain
      71: CloudSnow, // Slight snow
      73: CloudSnow, // Moderate snow
      75: CloudSnow, // Heavy snow
      80: CloudRain, // Slight rain showers
      81: CloudRain, // Moderate rain showers
      82: CloudRain, // Violent rain showers
      95: Zap,       // Thunderstorm
      96: Zap,       // Thunderstorm with hail
      99: Zap        // Thunderstorm with heavy hail
    };
    
    return iconMap[code] || Cloud;
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return descriptions[code] || 'Unknown';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-red-400';
    if (temp >= 25) return 'text-orange-400';
    if (temp >= 15) return 'text-yellow-400';
    if (temp >= 5) return 'text-blue-400';
    return 'text-cyan-400';
  };

  const WeatherIcon = getWeatherIcon(weather.weatherCode);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-8 text-center relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse-slow"></div>
      
      <div className="relative z-10">
        {/* Weather Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <WeatherIcon className="w-24 h-24 mx-auto text-blue-300" />
        </motion.div>

        {/* Temperature */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className={`text-6xl font-bold ${getTemperatureColor(weather.temperature)} mb-2`}>
            {weather.temperature}°C
          </div>
          <div className="text-lg text-blue-200">
            Feels like {weather.feelsLike}°C
          </div>
        </motion.div>

        {/* Weather Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-xl text-white font-medium">
            {getWeatherDescription(weather.weatherCode)}
          </p>
        </motion.div>

        {/* Weather Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Droplets className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-blue-200">Humidity</p>
              <p className="text-lg font-semibold text-white">{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <Wind className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-sm text-blue-200">Wind</p>
              <p className="text-lg font-semibold text-white">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </motion.div>

        {/* City Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <p className="text-blue-200 text-sm">Current weather in</p>
          <p className="text-2xl font-bold cosmic-text">{city}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;