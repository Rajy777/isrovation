import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Download, Satellite, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const SatelliteModal = ({ isOpen, onClose, cityName, coordinates }) => {
  const [satelliteData, setSatelliteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen && cityName) {
      fetchSatelliteImage();
    }
  }, [isOpen, cityName, selectedDate]);

  const fetchSatelliteImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/satellite/${cityName}`, {
        params: { date: selectedDate }
      });
      
      if (response.data.success) {
        setSatelliteData(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch satellite image');
      }
    } catch (error) {
      console.error('Failed to fetch satellite image:', error);
      setError('Failed to load satellite image');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // 30 days ago
    return date.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Satellite className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Satellite View</h2>
                <p className="text-blue-200">{cityName}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 glass-hover rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Date Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Select Date
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="glass rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={fetchSatelliteImage}
                disabled={loading}
                className="px-4 py-2 cosmic-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Update Image'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="spinner"></div>
                <span className="ml-3 text-blue-200">Loading satellite image...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">Unable to load satellite image</p>
                  <p className="text-blue-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {satelliteData && !loading && (
              <div className="space-y-4">
                {/* Image */}
                <div className="relative">
                  <img
                    src={satelliteData.imageUrl}
                    alt={`Satellite view of ${cityName}`}
                    className="w-full h-96 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x400/1e40af/ffffff?text=Satellite+Image+Unavailable';
                    }}
                  />
                  
                  {satelliteData.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <div className="text-center text-white">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Using placeholder image</p>
                        <p className="text-xs text-gray-300">{satelliteData.error}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="glass rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-blue-200 mb-2">Image Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Date:</span>
                          <span className="text-white">{satelliteData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Source:</span>
                          <span className="text-white">{satelliteData.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Location:</span>
                          <span className="text-white">{cityName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-blue-200 mb-2">Coordinates</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Latitude:</span>
                          <span className="text-white">{satelliteData.coordinates.lat}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Longitude:</span>
                          <span className="text-white">{satelliteData.coordinates.lon}°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-blue-200">
                    Satellite imagery provided by NASA Earth Imagery API
                  </p>
                  
                  <button
                    onClick={() => window.open(satelliteData.imageUrl, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 glass-hover rounded-lg text-blue-200 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>View Full Size</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SatelliteModal;