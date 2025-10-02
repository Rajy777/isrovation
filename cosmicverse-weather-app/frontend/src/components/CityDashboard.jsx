import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Satellite,
  Waves,
  Calendar,
  Clock,
  RefreshCw,
  Image
} from 'lucide-react';
import axios from 'axios';
import WeatherChart from './WeatherChart';
import WeatherCard from './WeatherCard';
import SatelliteModal from './SatelliteModal';

const API_BASE_URL = '/api';

const CityDashboard = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [satelliteModalOpen, setSatelliteModalOpen] = useState(false);

  useEffect(() => {
    fetchCityWeather();
  }, [cityName]);

  const fetchCityWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/weather/${cityName}`);
      
      if (response.data.success) {
        setWeatherData(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setError(error.response?.data?.error || 'City not found or API error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCityWeather();
    setRefreshing(false);
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
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
    
    return weatherCodes[code] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass rounded-2xl p-8 max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-4">City Not Found</h2>
          <p className="text-blue-200 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 cosmic-gradient text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const { weather, ocean, city } = weatherData;

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors glass-hover rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">{city.name}</h1>
            <p className="text-blue-200">{city.state}</p>
            {city.coastal && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-300 mt-2">
                <Waves className="w-4 h-4 mr-1" />
                Coastal City
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 glass-hover rounded-lg px-4 py-2 text-blue-200 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <div className="text-right text-blue-200">
              <p className="text-sm">Last updated</p>
              <p className="text-xs">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Weather Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <WeatherCard weather={weather.current} city={city.name} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4 text-center">
            <Thermometer className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-blue-200">Feels Like</p>
            <p className="text-2xl font-bold text-white">{weather.current.feelsLike}°C</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-blue-200">Humidity</p>
            <p className="text-2xl font-bold text-white">{weather.current.humidity}%</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <Wind className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-blue-200">Wind Speed</p>
            <p className="text-2xl font-bold text-white">{weather.current.windSpeed} km/h</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-blue-200">Condition</p>
            <p className="text-sm font-semibold text-white">
              {getWeatherDescription(weather.current.weatherCode)}
            </p>
          </div>
        </motion.div>

        {/* Charts and Additional Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weather Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                7-Day Forecast
              </h3>
              <WeatherChart data={weather.daily} />
            </div>
          </motion.div>

          {/* Ocean Data or Satellite */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Ocean Data (if coastal) */}
            {city.coastal && ocean && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Waves className="w-5 h-5 mr-2" />
                  Ocean Conditions
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Wave Height</span>
                    <span className="text-white font-semibold">
                      {ocean.current.waveHeight ? `${ocean.current.waveHeight}m` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Wave Period</span>
                    <span className="text-white font-semibold">
                      {ocean.current.wavePeriod ? `${ocean.current.wavePeriod}s` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Current Velocity</span>
                    <span className="text-white font-semibold">
                      {ocean.current.currentVelocity ? `${ocean.current.currentVelocity} m/s` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Satellite View */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Satellite className="w-5 h-5 mr-2" />
                Satellite View
              </h3>
              
              <div className="text-center">
                <button
                  onClick={() => setSatelliteModalOpen(true)}
                  className="w-full glass-hover rounded-lg p-6 transition-all duration-300 group"
                >
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-blue-400 transition-colors" />
                  <p className="text-blue-200 text-sm group-hover:text-white transition-colors">
                    View Satellite Image
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    NASA Earth Imagery
                  </p>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hourly Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              24-Hour Forecast
            </h3>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {weather.hourly.slice(0, 12).map((hour, index) => (
                  <div key={index} className="flex-shrink-0 text-center min-w-[80px] glass rounded-lg p-3">
                    <p className="text-xs text-blue-200 mb-2">
                      {new Date(hour.time).toLocaleTimeString('en-US', { 
                        hour: 'numeric',
                        hour12: true 
                      })}
                    </p>
                    <p className="text-lg font-semibold text-white mb-1">
                      {hour.temperature}°
                    </p>
                    <p className="text-xs text-blue-300">
                      {hour.precipitation}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Satellite Modal */}
        <SatelliteModal
          isOpen={satelliteModalOpen}
          onClose={() => setSatelliteModalOpen(false)}
          cityName={city.name}
          coordinates={city.coordinates}
        />
      </div>
    </div>
  );
};

export default CityDashboard;