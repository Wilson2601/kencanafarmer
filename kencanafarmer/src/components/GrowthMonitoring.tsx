import React, { useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sprout, Leaf, Flower, Apple, Camera, Loader2, Package } from "lucide-react";
// 1. Import the global data Hook
import { useCrops } from "../contexts/CropContext";

// Define growth stages (Universal for all crops)
const STAGES = ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'];

export function GrowthMonitoring() {
  // 2. Use global data instead of local useState
  const { crops, updateCropStage } = useCrops();
  
  // This state is only for UI loading effects, so it stays local
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    console.log(`Uploading photo for crop ID: ${id}`);

    // Simulate API delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Call the global update function (Logic from Context)
    updateCropStage(id);

    setUploadingId(null);
    e.target.value = ""; // Reset input to allow re-uploading the same file
  };

  // Helper function: Calculate estimated days (Simple logic: remaining stages * 5 days)
  const calculateDaysToNext = (currentStageIndex: number) => {
      const remainingStages = STAGES.length - 1 - currentStageIndex;
      return Math.max(remainingStages * 5, 0);
  };

  const getStageIcon = (index: number, currentStage: number) => {
    const isActive = index <= currentStage;
    const baseClass = "w-6 h-6";
    const colorClass = isActive ? "text-green-600" : "text-gray-300";
    
    switch (index) {
      case 0: return <Sprout className={`${baseClass} ${colorClass}`} />;
      case 1: return <Leaf className={`${baseClass} ${colorClass}`} />;
      case 2: return <Flower className={`${baseClass} ${colorClass}`} />;
      case 3: return <Apple className={`${baseClass} ${colorClass}`} />;
      case 4: return <Package className={`${baseClass} ${colorClass}`} />; // Use Package icon for Ready
      default: return <Sprout className={`${baseClass} ${colorClass}`} />;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-800">Growth Monitoring</h1>
        <p className="text-green-600">Snap a photo to update progress</p>
      </div>

      <div className="space-y-6">
        {/* If no crops exist, show a prompt */}
        {crops.length === 0 && (
            <div className="text-center p-8 text-gray-500 bg-white rounded-xl">
                <Sprout className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                <p>No crops yet. Go to "Crops" to add one!</p>
            </div>
        )}

        {crops.map((crop) => (
          <Card key={crop.id} className="p-5 bg-white relative overflow-hidden">
            
            {/* Loading Overlay: Shows when analyzing this specific card */}
            {uploadingId === crop.id && (
              <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                <p className="text-sm font-medium text-green-700">AI Analyzing...</p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                {/* Note: using 'name' and 'location' from Context */}
                <h3 className="text-lg font-bold text-green-900">{crop.name}</h3>
                <p className="text-sm text-green-600 flex items-center gap-1">
                    📍 {crop.location}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        id={`upload-${crop.id}`} 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, crop.id)}
                        disabled={uploadingId !== null}
                    />
                    <label 
                        htmlFor={`upload-${crop.id}`}
                        className={`
                            flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 
                            rounded-lg text-xs font-semibold cursor-pointer hover:bg-green-200 transition
                            ${uploadingId !== null ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Camera size={14} />
                        Update
                    </label>
                </div>
                
                <div className="text-right">
                    <span className={`text-xl font-bold ${getHealthColor(crop.health)}`}>
                        {crop.health}%
                    </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Progress 
                // Note: using stageIndex to calculate progress
                value={(crop.stageIndex / (STAGES.length - 1)) * 100} 
                className="h-3"
                indicatorClassName={getHealthBg(crop.health)}
              />
            </div>

            {/* Icons */}
            <div className="flex justify-between mb-4 px-1">
              {STAGES.map((stageName, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-1/5">
                  <div className={`
                    p-2 rounded-full transition-colors duration-300
                    ${index <= crop.stageIndex ? 'bg-green-100 scale-110' : 'bg-gray-50'}
                  `}>
                    {getStageIcon(index, crop.stageIndex)}
                  </div>
                  <p className={`text-[10px] sm:text-xs text-center font-medium ${index <= crop.stageIndex ? 'text-green-700' : 'text-gray-400'}`}>
                    {stageName}
                  </p>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-xs text-blue-500 font-semibold uppercase">Next Stage</p>
                    <p className="text-sm text-blue-900 font-bold">
                        {STAGES[crop.stageIndex + 1] || 'Harvest Ready'}
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-blue-500 font-semibold uppercase">Estimated</p>
                    <p className="text-sm text-blue-900 font-bold">
                        {calculateDaysToNext(crop.stageIndex)} days
                    </p>
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}