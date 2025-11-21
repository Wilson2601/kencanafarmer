import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { ChevronRight, Bell, Globe, HelpCircle, Shield, User } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [harvestReminders, setHarvestReminders] = useState(true);

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800">Settings</h1>
        <p className="text-green-600">Manage your preferences</p>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        <h2 className="text-green-800 mb-3">Profile</h2>
        <Card className="bg-white">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-green-900">Farmer Profile</p>
              <p className="text-sm text-green-600">Update your information</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </Card>
      </div>

      {/* Notifications Section */}
      <div className="mb-6">
        <h2 className="text-green-800 mb-3">Notifications</h2>
        <Card className="bg-white divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-green-900">Push Notifications</p>
                <p className="text-sm text-green-600">Receive alerts on your device</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-green-900">Weather Alerts</p>
                <p className="text-sm text-green-600">Get weather warnings</p>
              </div>
            </div>
            <Switch
              checked={weatherAlerts}
              onCheckedChange={setWeatherAlerts}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-green-900">Harvest Reminders</p>
                <p className="text-sm text-green-600">Alerts for harvest time</p>
              </div>
            </div>
            <Switch
              checked={harvestReminders}
              onCheckedChange={setHarvestReminders}
            />
          </div>
        </Card>
      </div>

      {/* General Section */}
      <div className="mb-6">
        <h2 className="text-green-800 mb-3">General</h2>
        <Card className="bg-white divide-y">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-green-900">Language</p>
              <p className="text-sm text-green-600">English</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-green-900">Help & Support</p>
              <p className="text-sm text-green-600">Get help with the app</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <div className="bg-red-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-green-900">Privacy Policy</p>
              <p className="text-sm text-green-600">View our privacy terms</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </Card>
      </div>

      {/* App Info */}
      <Card className="p-5 bg-white text-center">
        <p className="text-green-900 mb-1">Farm Manager</p>
        <p className="text-sm text-green-600">Version 1.0.0</p>
      </Card>
    </div>
  );
}
