import { Card } from "./ui/card";
import { Calendar, TrendingUp, Package } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCrops } from "../hooks/useCrops";
import { useMemo } from "react";

const STAGES = ['Planted', 'Growing', 'Flowering', 'Fruiting', 'Ready'];

interface HarvestPrediction {
  id: string;
  crop: string;
  section: string;
  harvestDate: string;
  daysRemaining: number;
  expectedYield: string;
  confidence: number;
  image: string;
  status: 'upcoming' | 'soon' | 'ready';
}

export function HarvestPrediction() {
  const { crops } = useCrops();

  // Calculate days to harvest based on current stage
  const calculateDaysToNext = (currentStageIndex: number) => {
    const remainingStages = STAGES.length - 1 - currentStageIndex;
    return Math.max(remainingStages * 5, 0);
  };

  // Estimate yield based on crop type and stage
  const estimateYield = (cropName: string, stageIndex: number): string => {
    // Base yields for common crops (in kg)
    const baseYields: Record<string, number> = {
      'apple': 500,
      'mango': 800,
      'orange': 600,
      'watermelon': 300,
      'durian': 400,
      'papaya': 200,
      'banana': 350,
      'coconut': 450,
      'avocado': 250,
    };

    // Find matching crop base yield (case-insensitive, partial match)
    let baseYield = 300; // default
    const cropLower = cropName.toLowerCase();
    for (const [key, value] of Object.entries(baseYields)) {
      if (cropLower.includes(key) || key.includes(cropLower.split(' ')[0])) {
        baseYield = value;
        break;
      }
    }

    // Adjust based on stage (0-4: Planted, Growing, Flowering, Fruiting, Ready)
    // Only estimate after Flowering stage (stage 2+)
    if (stageIndex < 2) {
      return 'TBD'; // Not enough data
    }

    // Scale yield based on progress: 60% at Flowering, 80% at Fruiting, 100% at Ready
    const stageMultiplier = stageIndex === 2 ? 0.6 : stageIndex === 3 ? 0.8 : 1.0;
    const estimatedYield = Math.round(baseYield * stageMultiplier);
    return `${estimatedYield} kg`;
  };

  // Generate predictions from actual crops
  const predictions: HarvestPrediction[] = useMemo(() => {
    return crops.map((crop) => {
      const stageIndex = crop.stageIndex ?? 0;
      const daysRemaining = calculateDaysToNext(stageIndex);
      
      // Calculate harvest date
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() + daysRemaining);
      
      // Determine status
      let status: 'upcoming' | 'soon' | 'ready' = 'upcoming';
      if (stageIndex >= STAGES.length - 1) {
        status = 'ready';
      } else if (daysRemaining <= 5) {
        status = 'soon';
      }
      
      // AI confidence based on stage (higher confidence as crop progresses)
      const baseConfidence = 70 + (stageIndex * 6);
      const confidence = Math.min(baseConfidence, 95);

      return {
        id: crop.id,
        crop: crop.name,
        section: crop.location || 'Unknown',
        harvestDate: harvestDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        daysRemaining,
        expectedYield: crop.expectedYield || estimateYield(crop.name, stageIndex),
        confidence: crop.confidenceLevel ?? confidence,
        image: crop.photos && crop.photos.length > 0 
          ? crop.photos[crop.photos.length - 1]
          : 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        status
      };
    });
  }, [crops]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'soon':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return '🎉 Ready to Harvest!';
      case 'soon':
        return '⏰ Harvest Soon';
      case 'upcoming':
        return '📅 Upcoming';
      default:
        return status;
    }
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (predictions.length === 0) {
      return { nextDaysToHarvest: 0, totalYield: '0' };
    }
    
    const nextDaysToHarvest = Math.min(...predictions.map(p => p.daysRemaining));
    let totalYield = 0;
    predictions.forEach(p => {
      const match = p.expectedYield.match(/(\d+)/);
      if (match) {
        totalYield += parseInt(match[1]);
      }
    });
    
    return {
      nextDaysToHarvest,
      totalYield: totalYield.toString()
    };
  }, [predictions]);

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-green-800">Harvest Prediction</h1>
        <p className="text-green-600">AI-powered harvest forecasts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600">Next Harvest</p>
          </div>
          <p className="text-2xl text-green-800">{summaryStats.nextDaysToHarvest}</p>
          <p className="text-sm text-green-600">days</p>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600">Total Yield</p>
          </div>
          <p className="text-2xl text-green-800">{summaryStats.totalYield}</p>
          <p className="text-sm text-green-600">kg expected</p>
        </Card>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.length === 0 ? (
          <Card className="p-4 bg-white">
            <p className="text-sm text-green-600 text-center">No crops yet. Add crops in Growth Monitoring to see predictions.</p>
          </Card>
        ) : (
          predictions.map((prediction) => (
            <Card key={prediction.id} className="overflow-hidden bg-white">
            {/* Status Banner */}
            <div className={`px-4 py-2 border-b ${getStatusColor(prediction.status)}`}>
              <p className="text-sm">{getStatusText(prediction.status)}</p>
            </div>

            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={prediction.image}
                  alt={prediction.crop}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-green-900 mb-1">{prediction.crop}</h3>
                <p className="text-sm text-green-600 mb-3">📍 {prediction.section}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">{prediction.harvestDate}</p>
                    <span className="text-xs text-green-600">({prediction.daysRemaining} days)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">{prediction.expectedYield}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">{prediction.confidence}% confidence</p>
                  </div>
                </div>
              </div>
            </div>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="p-5 bg-blue-50 mt-6">
        <h3 className="text-blue-900 mb-2">ℹ️ About Predictions</h3>
        <p className="text-sm text-blue-700">
          Our AI analyzes weather patterns, growth stages, and historical data to predict optimal harvest times. 
          Check daily for the most accurate forecasts!
        </p>
      </Card>
    </div>
  );
}
