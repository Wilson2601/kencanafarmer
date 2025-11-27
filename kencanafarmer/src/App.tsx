import { useState } from 'react';
// 1. Import the Context Providers (The "Global Databases")
import { TaskProvider } from './contexts/TaskContext';
import { CropProvider } from './contexts/CropContext';

import { Dashboard } from './components/Dashboard';
import { CropManagement } from './components/CropManagement';
import { Reminders } from './components/Reminders';
import { GrowthMonitoring } from './components/GrowthMonitoring';
import { HarvestPrediction } from './components/HarvestPrediction';
import { Settings } from './components/Settings';
import { Home, Sprout, Bell, TrendingUp, Calendar, Settings as SettingsIcon } from 'lucide-react';

type Page = 'dashboard' | 'crops' | 'reminders' | 'growth' | 'harvest' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onGoToReminders={() => setCurrentPage('reminders')} onGoToCrops={() => setCurrentPage('crops')} />;
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
    { id: 'dashboard' as Page, icon: Home, label: 'Home' },
    { id: 'crops' as Page, icon: Sprout, label: 'Crops' },
    { id: 'reminders' as Page, icon: Bell, label: 'Tasks' },
    { id: 'growth' as Page, icon: TrendingUp, label: 'Growth' },
    { id: 'harvest' as Page, icon: Calendar, label: 'Harvest' },
    { id: 'settings' as Page, icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    // 2. Wrap everything with the Providers
    // Now, every component inside here can access the data!
    <TaskProvider>
      <CropProvider>
        <div className="min-h-screen bg-green-50">
          <main className="max-w-md mx-auto bg-white shadow-xl min-h-screen relative">
            
            {renderPage()}

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
                        isActive ? 'bg-green-100 text-green-700' : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </main>
        </div>
      </CropProvider>
    </TaskProvider>
  );
}