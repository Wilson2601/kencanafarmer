import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sprout, Leaf, Flower, Apple } from "lucide-react";

interface GrowthStage {
  id: number;
  crop: string;
  type: string;
  stage: number;
  stages: string[];
  health: number;
  daysToNext: number;
  color: string;
}

export function GrowthMonitoring() {
  const crops: GrowthStage[] = [
    {
      id: 1,
      crop: 'Apple Trees',
      type: 'Section A',
      stage: 3,
      stages: ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'],
      health: 85,
      daysToNext: 15,
      color: 'red'
    },
    {
      id: 2,
      crop: 'Orange Grove',
      type: 'Section B',
      stage: 2,
      stages: ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'],
      health: 70,
      daysToNext: 25,
      color: 'orange'
    },
    {
      id: 3,
      crop: 'Mango Orchard',
      type: 'Section C',
      stage: 4,
      stages: ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'],
      health: 95,
      daysToNext: 5,
      color: 'yellow'
    }
  ];

  const getStageIcon = (index: number, currentStage: number) => {
    const isActive = index <= currentStage;
    const baseClass = "w-6 h-6";
    const colorClass = isActive ? "text-green-600" : "text-gray-300";
    
    switch (index) {
      case 0:
        return <Sprout className={`${baseClass} ${colorClass}`} />;
      case 1:
        return <Leaf className={`${baseClass} ${colorClass}`} />;
      case 2:
        return <Flower className={`${baseClass} ${colorClass}`} />;
      case 3:
        return <Apple className={`${baseClass} ${colorClass}`} />;
      case 4:
        return <Apple className={`${baseClass} ${colorClass}`} />;
      default:
        return <Sprout className={`${baseClass} ${colorClass}`} />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (health: number) => {
    if (health >= 80) return 'bg-green-600';
    if (health >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800">Growth Monitoring</h1>
        <p className="text-green-600">Track your crops' progress</p>
      </div>

      {/* Crops Growth */}
      <div className="space-y-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="p-5 bg-white">
            {/* Crop Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-green-900">{crop.crop}</h3>
                <p className="text-sm text-green-600">📍 {crop.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl ${getHealthColor(crop.health)}`}>{crop.health}%</p>
                <p className="text-sm text-green-600">Health</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Progress 
                value={(crop.stage / (crop.stages.length - 1)) * 100} 
                className="h-3"
                indicatorClassName={getHealthBg(crop.health)}
              />
            </div>

            {/* Growth Stages */}
            <div className="flex justify-between mb-4">
              {crop.stages.map((stage, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${index <= crop.stage ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {getStageIcon(index, crop.stage)}
                  </div>
                  <p className={`text-xs text-center ${index <= crop.stage ? 'text-green-700' : 'text-gray-400'}`}>
                    {stage}
                  </p>
                </div>
              ))}
            </div>

            {/* Next Stage Info */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="text-blue-600">Next Stage:</span> {crop.stages[crop.stage + 1] || 'Harvest Time!'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                ⏱️ Estimated: {crop.daysToNext} days
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips Card */}
      <Card className="p-5 bg-gradient-to-br from-green-600 to-green-700 text-white mt-6">
        <h3 className="mb-2">💡 Growing Tip</h3>
        <p className="text-sm opacity-90">
          Monitor your crops daily during the flowering stage. This is the most critical period for fruit development.
        </p>
      </Card>
    </div>
  );
}
