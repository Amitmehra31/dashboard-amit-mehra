import React, { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { MapPin, Droplets, Wind } from 'lucide-react';
import { WeatherData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WeatherWidgetProps {
  id: string;
  title: string;
  size: 'sm' | 'md' | 'lg';
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ id, title, size }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem(`weatherLocation-${id}`);
    return savedLocation || 'London';
  });
  const [searchQuery, setSearchQuery] = useState(location);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location.trim())}&appid=${API_KEY}&units=metric`
        );

        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }

        const data = await response.json();
        
        const weatherData: WeatherData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
        };
        
        setWeather(weatherData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(errorMessage);
        console.error('Weather widget error:', { error: err, location });
      } finally {
        setLoading(false);
      }
    };

    if (location.trim()) {
      fetchWeatherData();
      
      const interval = setInterval(fetchWeatherData, 300000);
      return () => clearInterval(interval);
    } else {
      setError('Please enter a city name');
      setLoading(false);
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      setError('Please enter a city name');
      return;
    }
    
    setLocation(trimmedQuery);
    localStorage.setItem(`weatherLocation-${id}`, trimmedQuery);
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <BaseWidget id={id} title={title} size={size}>
      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter location..."
            icon={<MapPin size={16} />}
          />
          <Button type="submit" disabled={!searchQuery.trim()}>Search</Button>
        </form>

        {loading && (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-error/10 p-4 text-error">
            {error}
          </div>
        )}

        {!loading && !error && weather && (
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-1">
              <MapPin size={16} className="text-theme-secondary" />
              <h3 className="text-lg font-semibold text-theme-primary">{weather.location}</h3>
            </div>
            
            <div className="mb-4 flex items-center justify-center">
              <img
                src={getWeatherIcon(weather.icon)}
                alt={weather.description}
                className="h-16 w-16"
              />
              <div>
                <p className="text-3xl font-bold text-theme-primary">{weather.temperature}°C</p>
                <p className="text-theme-secondary capitalize">{weather.description}</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Droplets size={16} className="text-primary" />
                <span className="text-theme-secondary">{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind size={16} className="text-theme-secondary" />
                <span className="text-theme-secondary">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};