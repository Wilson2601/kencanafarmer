import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Apple, Droplet, Sun, TrendingUp, TrendingDown, Cloud, CloudRain, Wind } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useCrops } from "../hooks/useCrops";

export function Dashboard({ onGoToReminders, onGoToCrops }: { onGoToReminders?: () => void; onGoToCrops?: () => void }) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const API_KEY = "d2230d5acc31c0fb701054e7cfb70fb4"; // Your OpenWeatherMap API Key

  function getWeatherIcon(iconCode: string) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Get real-time weather and 5-day forecast
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Current weather
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const weatherData = await weatherRes.json();
          setWeather(weatherData);

          // 5-day forecast
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const forecastData = await forecastRes.json();
          
          // Get one forecast per day (every 24 hours)
          const dailyForecasts = [];
          const seenDates = new Set<string>();
          
          for (const item of forecastData.list) {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!seenDates.has(date) && dailyForecasts.length < 5) {
              seenDates.add(date);
              dailyForecasts.push({
                date,
                temp: Math.round(item.main.temp),
                tempMax: Math.round(item.main.temp_max),
                tempMin: Math.round(item.main.temp_min),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed * 10) / 10
              });
            }
          }
          
          setForecast(dailyForecasts);
        } catch (err) {
          console.error("Weather API Error:", err);
        }
      },
      (err) => {
        console.error("Location Error:", err);
      }
    );
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { tasks } = useTasks();
  const { crops } = useCrops();
  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800 mb-1">Welcome Back!</h1>
        <p className="text-green-600">{today}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={onGoToCrops}
          style={{ background: 'none', border: 'none', padding: 0 }}
          className="text-left"
        >
          <Card className="p-4 bg-white border-green-200 hover:bg-green-50 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl text-green-800">{crops.length}</p>
                <p className="text-sm text-green-600">Active Crops</p>
              </div>
            </div>
          </Card>
        </button>

        <button
          onClick={onGoToReminders}
          style={{ background: 'none', border: 'none', padding: 0 }}
          className="text-left"
        >
          <Card className="p-4 bg-white border-orange-200 hover:bg-orange-50 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Sun className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl text-orange-800">{activeTasks.length}</p>
                <p className="text-sm text-orange-600">Tasks Today</p>
              </div>
            </div>
          </Card>
        </button>
      </div>

      {/* Today's Tasks */}
      <div className="mb-6">
        <h2 className="text-green-800 mb-3">Today's Tasks</h2>
        <div className="space-y-3">
          {activeTasks.length === 0 ? (
            <Card className="p-4 bg-white">
              <div className="text-sm text-green-600">No tasks for today.</div>
            </Card>
          ) : (
            activeTasks.map((task) => (
              <button
                key={task.id}
                className="w-full text-left"
                onClick={onGoToReminders}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <Card className="p-4 bg-white hover:bg-green-50 cursor-pointer transition">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-1 ${task.type === 'water' ? 'bg-blue-100' : task.type === 'prune' ? 'bg-purple-100' : task.type === 'fertilize' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {task.type === 'water' ? (
                        <Droplet className="w-5 h-5 text-blue-600" />
                      ) : task.type === 'prune' ? (
                        <TrendingDown className="w-5 h-5 text-purple-600" />
                      ) : task.type === 'fertilize' ? (
                        <Apple className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-green-900">{task.title}</p>
                      <p className="text-sm text-green-600">{task.crop}</p>
                    </div>
                    <div className="bg-green-50 px-3 py-1 rounded-full">
                      <p className="text-sm text-green-700">{task.time}</p>
                    </div>
                  </div>
                </Card>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Weather Widget - Current (Agricultural View) */}
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white mb-4 shadow-lg rounded-2xl">
        {weather ? (
          <div>
            {/* Top Row: Location, Temp, Icon */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-blue-100 font-medium">{weather.name}</h3>
                </div>
                <h1 className="text-5xl font-bold mb-1">{Math.round(weather.main.temp)}°C</h1>
                <p className="text-blue-100 capitalize font-medium">
                  {weather.weather[0].description}
                </p>
              </div>
              {/* Large Icon */}
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <img
                  src={getWeatherIcon(weather.weather[0].icon)}
                  alt={weather.weather[0].description}
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-blue-400/30 w-full mb-6"></div>

            {/* Bottom Row: Farming Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Humidity - Important for fungus/disease */}
              <div className="flex items-center gap-3 bg-blue-700/20 p-3 rounded-xl border border-blue-400/20">
