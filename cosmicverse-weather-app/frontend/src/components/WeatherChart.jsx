import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const WeatherChart = ({ data }) => {
  // Transform data for chart
  const chartData = data.map((day, index) => ({
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    date: day.date,
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    precipitation: day.precipitation,
    windSpeed: day.windSpeed
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-white/20">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey.includes('Temp') ? '°C' : 
               entry.dataKey === 'precipitation' ? 'mm' : 
               entry.dataKey === 'windSpeed' ? ' km/h' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Temperature Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#93c5fd"
              fontSize={12}
            />
            <YAxis 
              stroke="#93c5fd"
              fontSize={12}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#93c5fd' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="maxTemp" 
              stroke="#f87171" 
              strokeWidth={3}
              dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
              name="Max Temp"
            />
            <Line 
              type="monotone" 
              dataKey="minTemp" 
              stroke="#60a5fa" 
              strokeWidth={3}
              dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
              name="Min Temp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Precipitation Chart */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Precipitation & Wind</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#93c5fd"
              fontSize={12}
            />
            <YAxis 
              stroke="#93c5fd"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="precipitation" 
              fill="#06b6d4" 
              name="Precipitation"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weather Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {chartData.slice(0, 4).map((day, index) => (
          <div key={index} className="glass rounded-lg p-3 text-center">
            <p className="text-xs text-blue-200 mb-1">{day.day}</p>
            <p className="text-lg font-bold text-white">
              {day.maxTemp}°/{day.minTemp}°
            </p>
            <p className="text-xs text-blue-300">
              {day.precipitation}mm rain
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherChart;