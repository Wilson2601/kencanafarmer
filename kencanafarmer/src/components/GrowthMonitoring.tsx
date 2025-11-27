
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sprout, Leaf, Flower, Apple, Camera, Loader2, Package, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { useCrops } from "../hooks/useCrops";
import { useTasks } from "../hooks/useTasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Define growth stages (Universal for all crops)
const STAGES = ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'];

interface AIAnalysis {
  health: number;
  stage: string;
  issues: string[];
  suggestions: string[];
  confidence: number;
}

export function GrowthMonitoring() {
  const { crops, updateCrop } = useCrops();
  const { addTask } = useTasks();
  
  // This state is only for UI loading effects, so it stays local
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AIAnalysis>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // AI analysis using Hugging Face
  const analyzePhotoWithAI = async (imageData: string): Promise<AIAnalysis> => {
    try {
      // Using Hugging Face Inference API (free tier available)
      // You need to add your HF token in .env: VITE_HUGGINGFACE_TOKEN=your_token_here
      const HF_TOKEN = (import.meta as any).env.VITE_HUGGINGFACE_TOKEN || "";
      
      if (!HF_TOKEN) {
        // Fallback to simulated analysis
        return generateSimulatedAnalysis();
      }

      // Use Vision model for crop health analysis
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
        {
          headers: { Authorization: `Bearer ${HF_TOKEN}` },
          method: "POST",
          body: imageData,
        }
      );

      const result = await response.json();
      return parseAIAnalysis(result, imageData);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      return generateSimulatedAnalysis();
    }
  };

  // Parse AI response and generate suggestions
  const parseAIAnalysis = (aiResponse: any, imageData: string): AIAnalysis => {
    const caption = aiResponse[0]?.generated_text || "";
    
    // Analyze caption for health indicators
    let health = 85;
    const issues: string[] = [];
    const suggestions: string[] = [];

    const lowerCaption = caption.toLowerCase();

    // Check for health indicators
    if (lowerCaption.includes("green") && lowerCaption.includes("healthy")) {
      health = 95;
    } else if (lowerCaption.includes("yellow") || lowerCaption.includes("wilting")) {
      health = 65;
      issues.push("Plant showing signs of stress");
      suggestions.push("Water the plant thoroughly");
    } else if (lowerCaption.includes("brown") || lowerCaption.includes("damaged")) {
      health = 45;
      issues.push("Significant damage detected");
      suggestions.push("Check for pests or disease");
      suggestions.push("Consider applying pesticide");
    } else if (lowerCaption.includes("flower")) {
      health = 80;
      suggestions.push("Plant is flowering - reduce nitrogen fertilizer");
    } else if (lowerCaption.includes("fruit")) {
      health = 90;
      suggestions.push("Fruits developing well - maintain regular watering");
    }

    if (!suggestions.length) {
      suggestions.push("Continue regular maintenance");
      suggestions.push("Monitor for pests weekly");
    }

    return {
      health: Math.min(health, 100),
      stage: extractStage(lowerCaption),
      issues,
      suggestions,
      confidence: 78
    };
  };

  const extractStage = (caption: string): string => {
    if (caption.includes("seed") || caption.includes("sprout")) return "Planted";
    if (caption.includes("leaf") && !caption.includes("flower")) return "Growing";
    if (caption.includes("flower")) return "Flowering";
    if (caption.includes("fruit")) return "Fruiting";
    return "Growing";
  };

  // Simulated AI analysis (when HF token not available)
  const generateSimulatedAnalysis = (): AIAnalysis => {
    const analyses: AIAnalysis[] = [
      {
        health: 85,
        stage: "Growing",
        issues: [],
        suggestions: ["Continue regular watering", "Monitor for pests"],
        confidence: 85
      },
      {
        health: 72,
        stage: "Growing",
        issues: ["Slight yellowing on lower leaves"],
        suggestions: ["Apply nitrogen fertilizer", "Increase watering frequency"],
        confidence: 80
      },
      {
        health: 90,
        stage: "Flowering",
        issues: [],
        suggestions: ["Reduce nitrogen, increase phosphorus", "Support heavy flower clusters"],
        confidence: 88
      },
      {
        health: 65,
        stage: "Growing",
        issues: ["Signs of water stress", "Leaf curl detected"],
        suggestions: ["Water immediately", "Add mulch to retain moisture"],
        confidence: 75
      },
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, cropId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(cropId);
    setAnalyzingId(cropId);
    console.log(`Uploading photo for crop ID: ${cropId}`);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        
        // Simulate AI analysis (2-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysis = await analyzePhotoWithAI(imageData);
        setAnalysisResults(prev => ({ ...prev, [cropId]: analysis }));

        // Update crop with analysis results
        const crop = crops.find(c => c.id === cropId);
        if (crop) {
          const currentStageIndex = crop.stageIndex ?? 0;
          const newStageIndex = Math.min(currentStageIndex + 1, STAGES.length - 1);
          
          updateCrop(cropId, {
            stageIndex: newStageIndex,
            health: analysis.health,
            photos: [...(crop.photos || []), imageData]
          });

          // Auto-add suggested tasks to reminders
          analysis.suggestions.forEach(suggestion => {
            addTask({
              title: `${suggestion} - ${crop.name}`,
              crop: crop.location || crop.name,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              type: suggestion.toLowerCase().includes('water') ? 'water' : suggestion.toLowerCase().includes('fertil') ? 'fertilize' : 'other'
            });
          });
        }

        setAnalyzingId(null);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Photo upload error:", err);
      setUploadingId(null);
      setAnalyzingId(null);
    } finally {
      e.target.value = "";
    }
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
                    <span className={`text-xl font-bold ${getHealthColor(crop.health ?? 100)}`}>
                        {crop.health ?? 100}%
                    </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Progress 
                // Note: using stageIndex to calculate progress
                value={((crop.stageIndex ?? 0) / (STAGES.length - 1)) * 100} 
                className="h-3"
                indicatorClassName={getHealthBg(crop.health ?? 100)}
              />
            </div>

            {/* Icons */}
            <div className="flex justify-between mb-4 px-1">
              {STAGES.map((stageName, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-1/5">
                  <div className={`
                    p-2 rounded-full transition-colors duration-300
                    ${index <= (crop.stageIndex ?? 0) ? 'bg-green-100 scale-110' : 'bg-gray-50'}
                  `}>
                    {getStageIcon(index, crop.stageIndex ?? 0)}
                  </div>
                  <p className={`text-[10px] sm:text-xs text-center font-medium ${index <= (crop.stageIndex ?? 0) ? 'text-green-700' : 'text-gray-400'}`}>
                    {stageName}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Analysis Result - Show inline if available */}
            {analysisResults[crop.id] && (
              <div className="space-y-3 mb-4">
                {/* Health Score */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-green-900">AI Analysis - Crop Health</span>
                    <span className="text-lg font-bold text-green-700">{analysisResults[crop.id].health}%</span>
                  </div>
                  <Progress value={analysisResults[crop.id].health} className="h-2" />
                </div>

                {/* Issues */}
                {analysisResults[crop.id].issues.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-xs font-semibold text-red-900 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-3 h-3" />
                      Issues Detected
                    </p>
                    <ul className="space-y-1">
                      {analysisResults[crop.id].issues.map((issue, idx) => (
                        <li key={idx} className="text-xs text-red-700">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-900 flex items-center gap-2 mb-2">
                    <Lightbulb className="w-3 h-3" />
                    Suggestions
                  </p>
                  <ul className="space-y-1">
                    {analysisResults[crop.id].suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-green-700">✓ {suggestion}</li>
                    ))}
                  </ul>
                </div>

                {/* Confidence */}
                <div className="text-xs text-gray-600 text-center">
                  AI Confidence: {analysisResults[crop.id].confidence}%
                </div>
              </div>
            )}

            {/* Analyzing Indicator */}
            {analyzingId === crop.id && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <p className="text-xs text-blue-700 font-semibold">AI Analyzing...</p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-xs text-blue-500 font-semibold uppercase">Next Stage</p>
                    <p className="text-sm text-blue-900 font-bold">
                        {STAGES[(crop.stageIndex ?? 0) + 1] || 'Harvest Ready'}
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-blue-500 font-semibold uppercase">Estimated</p>
                    <p className="text-sm text-blue-900 font-bold">
                        {calculateDaysToNext(crop.stageIndex ?? 0)} days
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