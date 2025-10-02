import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Network, 
  MapPin,
  Waves,
  Mountain,
  Sun,
  Cloud
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const KnowledgeGraph = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClimate, setSelectedClimate] = useState('all');
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    filterCities();
  }, [cities, searchQuery, selectedClimate]);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      if (response.data.success) {
        const citiesWithClimate = response.data.data.map(city => ({
          ...city,
          climate: getClimateZone(city.lat)
        }));
        setCities(citiesWithClimate);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClimateZone = (lat) => {
    if (lat >= 30) return 'temperate';
    if (lat >= 23.5) return 'subtropical';
    if (lat >= 8) return 'tropical';
    return 'equatorial';
  };

  const getClimateInfo = (climate) => {
    const climateData = {
      temperate: {
        name: 'Temperate',
        description: 'Cool winters, warm summers',
        icon: Mountain,
        color: 'text-blue-400'
      },
      subtropical: {
        name: 'Subtropical',
        description: 'Hot summers, mild winters',
        icon: Sun,
        color: 'text-orange-400'
      },
      tropical: {
        name: 'Tropical',
        description: 'Hot and humid year-round',
        icon: Cloud,
        color: 'text-green-400'
      },
      equatorial: {
        name: 'Equatorial',
        description: 'Hot and wet year-round',
        icon: CloudRain,
        color: 'text-cyan-400'
      }
    };
    return climateData[climate] || climateData.tropical;
  };

  const filterCities = () => {
    let filtered = cities;

    if (searchQuery) {
      filtered = filtered.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedClimate !== 'all') {
      filtered = filtered.filter(city => city.climate === selectedClimate);
    }

    setFilteredCities(filtered);
  };

  const getNearbyCities = (targetCity) => {
    return cities.filter(city => {
      if (city.name === targetCity.name) return false;
      const distance = calculateDistance(
        targetCity.lat, targetCity.lon,
        city.lat, city.lon
      );
      return distance < 200; // Within 200km
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const climateZones = ['all', 'temperate', 'subtropical', 'tropical', 'equatorial'];

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
            <h1 className="text-4xl font-bold text-white flex items-center justify-center">
              <Network className="w-10 h-10 mr-3 text-blue-400" />
              Knowledge Graph
            </h1>
            <p className="text-blue-200 mt-2">Explore relationships between Indian cities</p>
          </div>
          
          <div className="text-right text-blue-200">
            <p className="text-sm">{cities.length} cities</p>
            <p className="text-xs">4 climate zones</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Climate Filter */}
            <div className="flex space-x-2">
              {climateZones.map((zone) => {
                const isActive = selectedClimate === zone;
                const climateInfo = zone === 'all' ? { name: 'All', color: 'text-white' } : getClimateInfo(zone);
                
                return (
                  <button
                    key={zone}
                    onClick={() => setSelectedClimate(zone)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive 
                        ? 'cosmic-gradient text-white' 
                        : 'glass-hover text-blue-200'
                    }`}
                  >
                    {climateInfo.name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Graph Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cities Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Cities Network ({filteredCities.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {filteredCities.map((city, index) => {
                  const climateInfo = getClimateInfo(city.climate);
                  const ClimateIcon = climateInfo.icon;
                  
                  return (
                    <motion.button
                      key={city.name}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      onClick={() => {
                        setSelectedCity(city);
                        navigate(`/city/${city.name.toLowerCase()}`);
                      }}
                      className={`glass-hover rounded-lg p-3 text-left group ${
                        selectedCity?.name === city.name ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <ClimateIcon className={`w-4 h-4 ${climateInfo.color}`} />
                      </div>
                      
                      <h4 className="text-white font-medium group-hover:cosmic-text transition-all duration-300">
                        {city.name}
                      </h4>
                      <p className="text-xs text-blue-200">{city.state}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${climateInfo.color}`}>
                          {climateInfo.name}
                        </span>
                        {city.coastal && (
                          <Waves className="w-3 h-3 text-cyan-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Climate Zones Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Climate Zones */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Climate Zones</h3>
              
              <div className="space-y-4">
                {climateZones.slice(1).map((zone) => {
                  const climateInfo = getClimateInfo(zone);
                  const ClimateIcon = climateInfo.icon;
                  const count = cities.filter(city => city.climate === zone).length;
                  
                  return (
                    <button
                      key={zone}
                      onClick={() => setSelectedClimate(zone)}
                      className="w-full glass-hover rounded-lg p-3 text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <ClimateIcon className={`w-6 h-6 ${climateInfo.color}`} />
                        <div className="flex-1">
                          <h4 className="text-white font-medium group-hover:cosmic-text transition-all duration-300">
                            {climateInfo.name}
                          </h4>
                          <p className="text-xs text-blue-200">{climateInfo.description}</p>
                          <p className="text-xs text-gray-400">{count} cities</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statistics */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total Cities</span>
                  <span className="text-white font-semibold">{cities.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Coastal Cities</span>
                  <span className="text-white font-semibold">
                    {cities.filter(city => city.coastal).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Climate Zones</span>
                  <span className="text-white font-semibold">4</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">States Covered</span>
                  <span className="text-white font-semibold">
                    {new Set(cities.map(city => city.state)).size}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Legend</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-200">City Location</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-blue-200">Coastal City</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-blue-200">Connected Cities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;