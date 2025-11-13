import { Card } from "./ui/card";
import { Apple, Droplet, Sun, TrendingUp } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800 mb-1">Welcome Back!</h1>
        <p className="text-green-600">Friday, October 31, 2025</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 bg-white border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Apple className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl text-green-800">12</p>
              <p className="text-sm text-green-600">Active Crops</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-orange-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl text-orange-800">3</p>
              <p className="text-sm text-orange-600">Tasks Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div className="mb-6">
        <h2 className="text-green-800 mb-3">Today's Tasks</h2>
        <div className="space-y-3">
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg mt-1">
                <Droplet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-green-900">Water Apple Trees</p>
                <p className="text-sm text-green-600">Section A - Morning</p>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <p className="text-sm text-blue-700">9:00 AM</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg mt-1">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-green-900">Check Orange Growth</p>
                <p className="text-sm text-green-600">Section B</p>
              </div>
              <div className="bg-purple-50 px-3 py-1 rounded-full">
                <p className="text-sm text-purple-700">2:00 PM</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg mt-1">
                <Apple className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-green-900">Harvest Mangoes</p>
                <p className="text-sm text-green-600">Section C</p>
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <p className="text-sm text-green-700">4:00 PM</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Weather Widget */}
      <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Today's Weather</p>
            <p className="text-3xl mt-1">28°C</p>
            <p className="text-sm opacity-90 mt-1">Partly Cloudy</p>
          </div>
          <Sun className="w-16 h-16 opacity-90" />
        </div>
      </Card>
    </div>
  );
}
