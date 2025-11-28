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
                <div className="bg-blue-100/20 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <p className="text-xl font-bold">{weather.main.humidity}%</p>
                  <p className="text-xs text-blue-200 uppercase tracking-wider">Humidity</p>
                </div>
              </div>

              {/* Wind Speed - Important for spraying crops */}
              <div className="flex items-center gap-3 bg-blue-700/20 p-3 rounded-xl border border-blue-400/20">
                <div className="bg-blue-100/20 p-2 rounded-lg">
                  <Wind className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <p className="text-xl font-bold">{weather.wind.speed} <span className="text-sm font-normal">m/s</span></p>
                  <p className="text-xs text-blue-200 uppercase tracking-wider">Wind Speed</p>
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
