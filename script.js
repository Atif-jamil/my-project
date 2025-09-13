// API key for OpenWeatherMap (this is a free key for demonstration)
const API_KEY = 'your_api_key_here';
// Note: In a real application, you should get your own API key from https://openweathermap.org/

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherImg = document.getElementById('weather-img');
const weatherDesc = document.getElementById('weather-desc');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecastCards = document.querySelector('.forecast-cards');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const now = new Date();
    currentDate.textContent = formatDate(now);
    
    // Set default city weather (London)
    getWeatherData('London');
    
    // Add event listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// Handle search functionality
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
        searchInput.value = '';
    } else {
        alert('Please enter a city name');
    }
}

// Get weather data from API
async function getWeatherData(city) {
    try {
        // Show loading state
        cityName.textContent = 'Loading...';
        temp.textContent = '--°C';
        
        // For demonstration purposes, we'll use mock data since we don't have a real API key
        // In a real app, you would fetch from the API:
        /*
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        */
        
        // Using mock data for demonstration
        const mockCurrentData = generateMockCurrentData(city);
        updateCurrentWeather(mockCurrentData);
        
        // Get forecast data
        // In a real app: 
        // const forecastResponse = await fetch(
        //     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        // );
        // const forecastData = await forecastResponse.json();
        
        const mockForecastData = generateMockForecastData();
        updateForecast(mockForecastData);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        cityName.textContent = 'Error loading data';
        alert('Could not fetch weather data. Please try again.');
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    weatherDesc.textContent = data.weather[0].description;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherImg.alt = data.weather[0].description;
}

// Update forecast UI
function updateForecast(data) {
    // Clear previous forecast
    forecastCards.innerHTML = '';
    
    // Get next 5 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    for (let i = 1; i <= 5; i++) {
        const dayIndex = (today + i) % 7;
        const forecast = data.list[i * 5]; // Get one reading per day (every 24 hours)
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        
        forecastCard.innerHTML = `
            <div class="forecast-day">${days[dayIndex]}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
        `;
        
        forecastCards.appendChild(forecastCard);
    }
}

// Format date to readable string
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Generate mock current weather data for demonstration
function generateMockCurrentData(city) {
    const temperatures = {
        'London': { temp: 18, feels_like: 17 },
        'Paris': { temp: 22, feels_like: 23 },
        'New York': { temp: 25, feels_like: 27 },
        'Tokyo': { temp: 28, feels_like: 30 },
        'Sydney': { temp: 15, feels_like: 14 },
        'Berlin': { temp: 20, feels_like: 19 },
        'Moscow': { temp: 12, feels_like: 10 },
        'Beijing': { temp: 26, feels_like: 28 },
        'Cairo': { temp: 32, feels_like: 35 },
        'Rio de Janeiro': { temp: 29, feels_like: 31 }
    };
    
    const weatherConditions = [
        { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
        { id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' },
        { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
        { id: 600, main: 'Snow', description: 'light snow', icon: '13d' }
    ];
    
    const cityData = temperatures[city] || { temp: 22, feels_like: 23 };
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    return {
        name: city,
        sys: { country: getCountryCode(city) },
        main: {
            temp: cityData.temp,
            feels_like: cityData.feels_like,
            humidity: Math.floor(Math.random() * 50) + 30
        },
        wind: {
            speed: (Math.random() * 10 + 2).toFixed(1)
        },
        weather: [randomWeather]
    };
}

// Generate mock forecast data for demonstration
function generateMockForecastData() {
    const forecast = {
        list: []
    };
    
    for (let i = 1; i <= 5; i++) {
        const temp = Math.floor(Math.random() * 15) + 15; // 15-30°C
        const weatherConditions = [
            { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
            { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
            { id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' },
            { id: 500, main: 'Rain', description: 'light rain', icon: '10d' }
        ];
        
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        forecast.list.push({
            main: { temp },
            weather: [randomWeather]
        });
    }
    
    return forecast;
}

// Helper function to get country code for mock data
function getCountryCode(city) {
    const countryCodes = {
        'London': 'GB',
        'Paris': 'FR',
        'New York': 'US',
        'Tokyo': 'JP',
        'Sydney': 'AU',
        'Berlin': 'DE',
        'Moscow': 'RU',
        'Beijing': 'CN',
        'Cairo': 'EG',
        'Rio de Janeiro': 'BR'
    };
    
    return countryCodes[city] || 'US';
}