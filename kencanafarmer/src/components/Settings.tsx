import { User, LogOut, ChevronRight, Bell, Shield } from "lucide-react";

// Define the props to accept the logout function
interface SettingsProps {
  onLogout: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-800">Settings</h1>
        <p className="text-green-600">Manage your preferences</p>
      </div>

      {/* 1. Profile Section */}
      <div className="mb-6">
        <h2 className="text-green-800 font-semibold mb-3">Profile</h2>
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-green-900 font-medium">Farmer Profile</p>
              <p className="text-sm text-green-600">Update your information</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-400" />
          </button>
        </div>
      </div>

      {/* General Settings (Visual only for now) */}
      <div className="mb-6">
        <h2 className="text-green-800 font-semibold mb-3">General</h2>
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden divide-y divide-green-50">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <Bell className="w-5 h-5 text-green-600" />
            <span className="flex-1 text-left text-green-900">Notifications</span>
            <ChevronRight className="w-5 h-5 text-green-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 hover:bg-green-50 transition-colors">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="flex-1 text-left text-green-900">Privacy & Security</span>
            <ChevronRight className="w-5 h-5 text-green-400" />
          </button>
        </div>
      </div>

      {/* 2. Log Out Button */}
      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 border border-red-100 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      <div className="mt-8 text-center">
        <p className="text-xs text-green-600">Farm Manager v1.0.2</p>
      </div>
    </div>
  );
}