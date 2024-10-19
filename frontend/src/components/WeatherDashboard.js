import React, { useEffect, useState } from 'react';
import { fetchWeatherSummary } from '../services/weatherService';
import WeatherCard from './WeatherCard';
import Charts from './Charts';
import AlertNotification from './AlertNotification';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] }); // State for chart data
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeatherSummary(); // Assuming this returns array of weather data
      setWeatherData(data);
      setFilteredData(data);
      setLoading(false);

      // Transform data for charts
      const labels = data.map((weather) => weather.city);
      const values = data.map((weather) => weather.temperature);
      setChartData({ labels, values });

      // Check for high-temperature alerts
      const alertCity = data.find((weather) => weather.temperature > 35);
      if (alertCity) {
        setAlertMessage(`High temperature alert: ${alertCity.city} is ${alertCity.temperature}°C`);
      }
    };

    getWeather();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter weather data based on search term
    const filtered = weatherData.filter((weather) =>
      weather.city.toLowerCase().includes(term)
    );
    setFilteredData(filtered);

    // Update chart data with filtered data
    const labels = filtered.map((weather) => weather.city);
    const values = filtered.map((weather) => weather.temperature);
    setChartData({ labels, values });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Real-Time Weather Dashboard</h1>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by city..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-4 p-2 border border-gray-300 rounded"
        />
      </header>

      {/* Alert Notification Component */}
      <AlertNotification alertMessage={alertMessage} onDismiss={() => setAlertMessage('')} />

      {loading ? (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-500">Loading weather data...</p>
        </div>
      ) : (
        <div>
          {/* Weather Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredData.map((weather, index) => (
              <WeatherCard key={index} weather={weather} />
            ))}
          </div>

          {/* Temperature Trends Graph */}
          <div className="mt-10 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Temperature Trends</h2>
            <Charts data={chartData} /> {/* Pass chart data */}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;