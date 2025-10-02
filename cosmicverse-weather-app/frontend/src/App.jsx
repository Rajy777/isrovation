import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './components/HomePage';
import CityDashboard from './components/CityDashboard';
import KnowledgeGraph from './components/KnowledgeGraph';
import ChatInterface from './components/ChatInterface';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Navigation />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityName" element={<CityDashboard />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
          </Routes>
        </motion.main>
        
        <ChatInterface />
      </div>
    </Router>
  );
}

export default App;