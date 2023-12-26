import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [userCity, setUserCity] = useState(null);

  useEffect(() => {
    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Replace 'YOUR_OPENCAGE_API_KEY' with your actual API key
          const openCageApiUrl = `https://api.opencagedata.com/geocode/v1/json?key=7b30fa70f8ff41f88f46acb70d01b633&q=${latitude}+${longitude}&pretty=1`;

          axios.get(openCageApiUrl)
            .then(response => {
              const city = response.data.results[0].components.city;
              setUserCity(city);
            })
            .catch(error => {
              console.error('Error fetching city:', error);
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    // Fetch weather data based on user's city
    if (userCity) {
      const apiUrl = 'https://goweather.herokuapp.com/weather/';
      axios.get(apiUrl + userCity)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [userCity]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Display fetched data */}
        {data && (
          <div>
            <h2>Weather in {userCity}</h2>
            <p>Temperature: {data.temperature}</p>
            <p>Wind: {data.wind}</p>
            <p>Description: {data.description}</p>

            <h3>3-Day Forecast:</h3>
            <ul>
              {data.forecast.map(day => (
                <li key={day.day}>
                  <b>Day {day.day}:</b> Temperature: {day.temperature}, Wind: {day.wind}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
