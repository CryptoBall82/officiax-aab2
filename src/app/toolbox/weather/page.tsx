// src/app/toolbox/weather/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarTools } from '@/components/NavbarTools';
import { useRouter } from 'next/navigation'; // Import useRouter, although not used in the provided logic block, it's good practice for pages

const WeatherPage = () => {
  const router = useRouter(); // Initialize router
  const [weatherData, setWeatherData] = useState<any>(null); // Use 'any' for now, consider defining a type/interface
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the device's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          setError('Could not retrieve location');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // Fetch weather data when location is available
    if (location.latitude && location.longitude) {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY; // Using env variable now
      if (!apiKey) {
        setError('OpenWeatherMap API key is missing.');
        console.error('OpenWeatherMap API key is missing.');
        return;
      }
      const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
      const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}&lon=${location.longitude}&limit=1&appid=${apiKey}`;

      const fetchWeatherData = async () => {
        try {
          // Fetch weather data
          const weatherResponse = await fetch(apiUrl);
          if (!weatherResponse.ok) {
            console.error('Weather API response error:', weatherResponse.status, await weatherResponse.text());
            throw new Error(`Weather API error (${weatherResponse.status})`);
          }
          const weatherResult = await weatherResponse.json();
          setWeatherData(weatherResult.current); // Assuming 'current' holds the relevant data

          // Fetch city name
          const geocodingResponse = await fetch(geocodingApiUrl);
           if (!geocodingResponse.ok) {
             console.error('Geocoding API response error:', geocodingResponse.status, await geocodingResponse.text());
            throw new Error(`Geocoding API error (${geocodingResponse.status})`); // CORRECTED LINE
          }
          const geocodingData = await geocodingResponse.json();
          if (geocodingData && geocodingData.length > 0) {
            setCity(geocodingData[0].name);
          } else {
             setCity('Unknown location');
          }

        } catch (error: any) {
           setError(`Could not retrieve weather data: ${error.message}`);
           console.error('Error fetching weather data:', error);
        }
      };

      fetchWeatherData();
    }
  }, [location]); // Re-run effect when location changes

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      {/* Add padding top and bottom to account for fixed header/navbar */}
      <main className="flex-grow relative w-full pt-[100px] pb-[100px] container mx-auto p-4 overflow-y-auto">
        {/* Removed redundant header */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {weatherData ? (
          <div className="flex flex-col items-center mb-4" style={{ backgroundColor: '#00129A', padding: '10px', borderRadius: '0px', color: 'white' }}>
            {city && <p className="text-lg font-semibold">{city}</p>}
            <p>Temperature: {weatherData.temp}°F</p>
            <p>Feels Like: {weatherData.feels_like}°F</p>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Wind Speed: {weatherData.wind_speed} mph</p>
            <p>Description: {weatherData.weather[0].description}</p>
          </div>
        ) : (
          !error && <p className="text-center mb-4">Loading weather data...</p> // Show loading only if no error
        )}
        <div className="relative w-full" style={{ height: '400px'}}> {/* Container for iframe */}
            <iframe
            src="https://www.meteoblue.com/en/weather/maps/widget?windAnimation=0&gust=0&satellite=1&cloudsAndPrecipitation=1&temperature=0&sunshine=0&extremeForecastIndex=0&geoloc=detect&tempunit=F&windunit=mph&lengthunit=imperial&zoom=5&autowidth=auto"
            frameBorder="0"
            scrolling="NO"
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            style={{width: '100%', height: '100%'}} // Fill the container div
            title="Meteoblue Weather Map"
            ></iframe>
        </div>
        <div className="text-center mt-2 text-xs">
          {/* DO NOT REMOVE THIS LINK */}
          <a
            href="https://www.meteoblue.com/en/weather/maps/index?utm_source=map_widget&amp;utm_medium=linkus&amp;utm_content=map&amp;utm_campaign=Weather%2BWidget"
            target="_blank"
            rel="noopener noreferrer" // Added noreferrer for security
            className="text-blue-400 hover:text-blue-300"
          >
            meteoblue
          </a>
        </div>
      </main>
      <NavbarTools />
    </div>
  );
};

export default WeatherPage;