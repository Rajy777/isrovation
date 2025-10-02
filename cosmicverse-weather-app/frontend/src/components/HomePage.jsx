import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Satellite, Waves, Cloud, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularCities();
  }, []);

  const fetchPopularCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      // Get first 8 cities as popular cities
      setPopularCities(response.data.data.slice(0, 8));
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/cities/search/${query}`);
        setSuggestions(response.data.data);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCitySelect = (cityName) => {
    navigate(`/city/${cityName.toLowerCase()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const exactMatch = suggestions.find(city => 
        city.name.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exactMatch) {
        handleCitySelect(exactMatch.name);
      } else if (suggestions.length > 0) {
        handleCitySelect(suggestions[0].name);
      } else {
        navigate(`/city/${searchQuery.toLowerCase()}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center px-4 py-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-16 h-16 text-blue-400 mr-4 animate-pulse" />
              <h1 className="text-6xl md:text-8xl font-bold text-white">
                Cosmic<span className="cosmic-text">Verse</span>
              </h1>
              <Sparkles className="w-16 h-16 text-purple-400 ml-4 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-blue-200 mb-8">
              Your Intelligent Weather Companion for India
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-300">
              <span className="flex items-center">
                <Cloud className="w-4 h-4 mr-1" />
                40+ Cities
              </span>
              <span className="flex items-center">
                <Satellite className="w-4 h-4 mr-1" />
                NASA Imagery
              </span>
              <span className="flex items-center">
                <Waves className="w-4 h-4 mr-1" />
                Ocean Data
              </span>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search any Indian city... (Mumbai, Delhi, Bangalore)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-10 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((city, index) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-3"
                    >
                      <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{city.name}</span>
                        <span className="text-blue-200 text-sm ml-2">{city.state}</span>
                        {city.coastal && (
                          <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                            Coastal
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-6 text-center cursor-pointer"
            >
              <Cloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Weather Forecasts</h3>
              <p className="text-blue-200">7-day detailed forecasts with hourly data</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-6 text-center cursor-pointer"
            >
              <Satellite className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Satellite Imagery</h3>
              <p className="text-blue-200">Real-time satellite views from NASA</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-6 text-center cursor-pointer"
            >
              <Waves className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ocean Data</h3>
              <p className="text-blue-200">Wave conditions for coastal cities</p>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <button
              onClick={() => navigate('/graph')}
              className="px-6 py-3 cosmic-gradient text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Knowledge Graph
            </button>
            <button
              onClick={() => handleCitySelect('Mumbai')}
              className="px-6 py-3 glass-hover text-white rounded-xl font-semibold"
            >
              Mumbai Weather
            </button>
            <button
              onClick={() => handleCitySelect('Delhi')}
              className="px-6 py-3 glass-hover text-white rounded-xl font-semibold"
            >
              Delhi Weather
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Cities */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="px-4 py-12 bg-black/20"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Popular Cities
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCities.map((city, index) => (
              <motion.button
                key={city.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCitySelect(city.name)}
                className="glass-hover rounded-xl p-4 text-center group"
              >
                <h3 className="text-lg font-semibold text-white group-hover:cosmic-text transition-all duration-300">
                  {city.name}
                </h3>
                <p className="text-sm text-blue-200">{city.state}</p>
                {city.coastal && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300">
                      <Waves className="w-3 h-3 mr-1" />
                      Coastal
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;