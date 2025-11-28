import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Apple, Droplet, Sun, TrendingUp, TrendingDown, Cloud, Wind } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useCrops } from "../hooks/useCrops";

export function Dashboard({ onGoToReminders, onGoToCrops }: { onGoToReminders?: () => void; onGoToCrops?: () => void }) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  
  // 🔑 API Key
  const API_KEY = "d2230d5acc31c0fb701054e7cfb70fb4"; 

  function getWeatherIcon(iconCode: string) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const weatherData = await weatherRes.json();
          setWeather(weatherData);

          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const forecastData = await forecastRes.json();

          const dailyForecasts: any[] = [];
          const seenDates = new Set<string>();

          for (const item of forecastData.list) {
            const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
                windSpeed: Math.round(item.wind.speed * 10) / 10,
              });
            }
          }
          setForecast(dailyForecasts);
        } catch (err) {
          console.error("Weather API Error:", err);
        }
      },
      (err) => { console.error("Location Error:", err); }
    );
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  
  const tasksResult = useTasks();
  const cropsResult = useCrops();
  const safeTasks = tasksResult?.tasks ?? [];
  const safeCrops = cropsResult?.crops ?? [];
  const activeTasks = safeTasks.filter((t: any) => !t.completed);

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800 mb-1">Welcome Back!</h1>
        <p className="text-green-600">{today}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={onGoToCrops} style={{ background: "none", border: "none", padding: 0 }} className="text-left">
          <Card className="p-4 bg-white border-green-200 hover:bg-green-50 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl text-green-800">{safeCrops.length}</p>
                <p className="text-sm text-green-600">Active Crops</p>
              </div>
            </div>
          </Card>
        </button>

        <button onClick={onGoToReminders} style={{ background: "none", border: "none", padding: 0 }} className="text-left">
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
            activeTasks.map((task: any) => (
              <button key={task.id} className="w-full text-left" onClick={onGoToReminders} style={{ background: "none", border: "none", padding: 0 }}>
                <Card className="p-4 bg-white hover:bg-green-50 cursor-pointer transition">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-1 ${task.type === "water" ? "bg-blue-100" : task.type === "prune" ? "bg-purple-100" : task.type === "fertilize" ? "bg-green-100" : "bg-orange-100"}`}>
                      {task.type === "water" ? <Droplet className="w-5 h-5 text-blue-600" /> : task.type === "prune" ? <TrendingDown className="w-5 h-5 text-purple-600" /> : task.type === "fertilize" ? <Apple className="w-5 h-5 text-green-600" /> : <TrendingUp className="w-5 h-5 text-orange-600" />}
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

      {/* Weather Widget */}
      {/* FIX: Using 'Card' to get shape, 'border-none' to remove white border, and 'style' to force blue */}
      <Card 
        className="p-6 text-white mb-6 shadow-md border-none relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }} 
      >
        {weather ? (
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-blue-100 font-medium">{weather.name}</h3>
                </div>
                <h1 className="text-5xl font-bold mb-1">{Math.round(weather.main.temp)}°C</h1>
                <p className="text-blue-100 capitalize font-medium">{weather.weather[0].description}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <img src={getWeatherIcon(weather.weather[0].icon)} alt={weather.weather[0].description} className="w-16 h-16" />
              </div>
            </div>

            <div className="h-px bg-blue-300/30 w-full mb-6"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-blue-800/20 p-3 rounded-xl border border-blue-300/20 backdrop-blur-sm">
                <div className="bg-blue-100/20 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-50" />
                </div>
                <div>
                  <p className="text-xl font-bold">{weather.main.humidity}%</p>
                  <p className="text-xs text-blue-100 uppercase tracking-wider">Humidity</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-blue-800/20 p-3 rounded-xl border border-blue-300/20 backdrop-blur-sm">
                <div className="bg-blue-100/20 p-2 rounded-lg">
                  <Wind className="w-5 h-5 text-blue-50" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {weather.wind.speed} <span className="text-sm font-normal">m/s</span>
                  </p>
                  <p className="text-xs text-blue-100 uppercase tracking-wider">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-80">
            <Cloud className="w-10 h-10 mb-2 animate-pulse" />
            <p className="text-sm font-medium">Analyzing local weather...</p>
          </div>
        )}
      </Card>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-green-800 font-semibold mb-3">5-Day Forecast</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {forecast.map((day, idx) => (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg border border-blue-100 min-w-[85px] shadow-sm">
                <p className="text-xs font-semibold text-blue-900 text-center">{day.date}</p>
                <img src={getWeatherIcon(day.icon)} alt={day.description} className="w-8 h-8" />
                <p className="text-sm font-bold text-blue-900">{day.temp}°C</p>
                <p className="text-xs text-blue-600 text-center">{day.tempMin}° ~ {day.tempMax}°</p>
                <div className="flex items-center gap-0.5 text-xs text-blue-600 justify-center">
                  <Wind className="w-3 h-3" />
                  <span>{day.windSpeed}m/s</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
