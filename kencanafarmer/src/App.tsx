import { useState } from 'react';

// Contexts
import { TaskProvider } from './contexts/TaskContext';
import { CropProvider } from './contexts/CropContext';

// Components
import Login from './components/Login'; 
import { Dashboard } from './components/Dashboard';
import { CropManagement } from './components/CropManagement';
import { Reminders } from './components/Reminders';
import { GrowthMonitoring } from './components/GrowthMonitoring';
import { HarvestPrediction } from './components/HarvestPrediction';
import Settings from './components/Settings'; // ✅ Fixed: Uncommented and using default import

import { Home, Sprout, Bell, TrendingUp, Calendar, Settings as SettingsIcon } from 'lucide-react';

type Page = 'dashboard' | 'crops' | 'reminders' | 'growth' | 'harvest' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // ✅ New: Handle Logout Logic
  const handleLogout = () => {
    setIsLoggedIn(false); // Go back to login screen
    setCurrentPage('dashboard'); // Reset page to dashboard for next time
  };

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
        // ✅ Fixed: Rendering actual Settings component with logout prop
        return <Settings onLogout={handleLogout} />;
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

  // 1. LOGIN CHECK
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // 2. MAIN APP
  return (
    <TaskProvider>
      <CropProvider>
        <div className="min-h-screen bg-green-50">
          <main className="max-w-md mx-auto bg-white shadow-xl min-h-screen relative pb-20">
            
            {renderPage()}

            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-green-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
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
                      <Icon size={20} className={isActive ? 'fill-current' : ''} />
                      <span className="text-[10px] font-medium mt-1">{item.label}</span>
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