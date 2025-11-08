import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CropManagement } from './components/CropManagement';
import { Reminders } from './components/Reminders';
import { GrowthMonitoring } from './components/GrowthMonitoring';
import { HarvestPrediction } from './components/HarvestPrediction';
import { Settings } from './components/Settings';
import { Home, Sprout, Bell, TrendingUp, Calendar, Settings as SettingsIcon } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <CropManagement />;
      case 'reminders':
        return <Reminders />;
      case 'growth':
        return <GrowthMonitoring />;
      case 'harvest':
        return <HarvestPrediction />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'crops', icon: Sprout, label: 'Crops' },
    { id: 'reminders', icon: Bell, label: 'Tasks' },
    { id: 'growth', icon: TrendingUp, label: 'Growth' },
    { id: 'harvest', icon: Calendar, label: 'Harvest' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Main Content */}
      <main className="max-w-md mx-auto bg-white shadow-xl min-h-screen relative">
        {renderPage()}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-green-200 shadow-lg">
          <div className="grid grid-cols-6 gap-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-green-700' : 'text-green-600'}`} />
                  <span className={`text-xs ${isActive ? 'text-green-700' : 'text-green-600'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
