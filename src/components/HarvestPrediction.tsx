import { Card } from "./ui/card";
import { Calendar, TrendingUp, Package } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HarvestPrediction {
  id: number;
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
  const predictions: HarvestPrediction[] = [
    {
      id: 1,
      crop: 'Mango Orchard',
      section: 'Section C',
      harvestDate: 'Nov 5, 2025',
      daysRemaining: 5,
      expectedYield: '850 kg',
      confidence: 95,
      image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NjE4OTg1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'ready'
    },
    {
      id: 2,
      crop: 'Apple Trees',
      section: 'Section A',
      harvestDate: 'Nov 15, 2025',
      daysRemaining: 15,
      expectedYield: '650 kg',
      confidence: 88,
      image: 'https://images.unsplash.com/photo-1634630486820-d2eae27becbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHRyZWUlMjBmcnVpdHxlbnwxfHx8fDE3NjE4OTg1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'soon'
    },
    {
      id: 3,
      crop: 'Orange Grove',
      section: 'Section B',
      harvestDate: 'Dec 10, 2025',
      daysRemaining: 40,
      expectedYield: '920 kg',
      confidence: 82,
      image: 'https://images.unsplash.com/photo-1741012253484-43b5b9b99491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjaXRydXMlMjBmYXJtfGVufDF8fHx8MTc2MTg5ODU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'upcoming'
    }
  ];

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
          <p className="text-2xl text-green-800">5</p>
          <p className="text-sm text-green-600">days</p>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600">Total Yield</p>
          </div>
          <p className="text-2xl text-green-800">2,420</p>
          <p className="text-sm text-green-600">kg expected</p>
        </Card>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.map((prediction) => (
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
        ))}
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
