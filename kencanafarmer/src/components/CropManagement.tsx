import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Apple, CircleDot } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Crop {
  id: number;
  name: string;
  type: string;
  section: string;
  planted: string;
  status: 'healthy' | 'attention' | 'ready';
  image: string;
}

export function CropManagement() {
  const [crops, setCrops] = useState<Crop[]>([
    {
      id: 1,
      name: 'Apple Trees',
      type: 'Apple',
      section: 'Section A',
      planted: 'Jan 2025',
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1634630486820-d2eae27becbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHRyZWUlMjBmcnVpdHxlbnwxfHx8fDE3NjE4OTg1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Orange Grove',
      type: 'Orange',
      section: 'Section B',
      planted: 'Mar 2025',
      status: 'attention',
      image: 'https://images.unsplash.com/photo-1741012253484-43b5b9b99491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjaXRydXMlMjBmYXJtfGVufDF8fHx8MTc2MTg5ODU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Mango Orchard',
      type: 'Mango',
      section: 'Section C',
      planted: 'Feb 2025',
      status: 'ready',
      image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NjE4OTg1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    type: '',
    section: '',
    planted: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700';
      case 'attention':
        return 'bg-yellow-100 text-yellow-700';
      case 'ready':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'attention':
        return 'Needs Care';
      case 'ready':
        return 'Ready';
      default:
        return status;
    }
  };

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.type && newCrop.section && newCrop.planted) {
      setCrops([...crops, {
        id: crops.length + 1,
        ...newCrop,
        status: 'healthy',
        image: 'https://images.unsplash.com/photo-1708057986191-9c0337c2f5c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMG9yY2hhcmQlMjBmYXJtfGVufDF8fHx8MTc2MTg5ODU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }]);
      setNewCrop({ name: '', type: '', section: '', planted: '' });
      setOpen(false);
    }
  };

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-green-800">My Crops</h1>
          <p className="text-green-600">{crops.length} crops planted</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 p-0">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%] rounded-lg">
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Crop Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Apple Trees"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Fruit Type</Label>
                <Select value={newCrop.type} onValueChange={(value) => setNewCrop({ ...newCrop, type: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select fruit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Orange">Orange</SelectItem>
                    <SelectItem value="Mango">Mango</SelectItem>
                    <SelectItem value="Banana">Banana</SelectItem>
                    <SelectItem value="Grapes">Grapes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Farm Section</Label>
                <Input
                  id="section"
                  placeholder="e.g., Section A"
                  value={newCrop.section}
                  onChange={(e) => setNewCrop({ ...newCrop, section: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="planted">Planting Date</Label>
                <Input
                  id="planted"
                  placeholder="e.g., Oct 2025"
                  value={newCrop.planted}
                  onChange={(e) => setNewCrop({ ...newCrop, planted: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddCrop} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Crop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Crops List */}
      <div className="space-y-4">
        {crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden bg-white">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-green-900">{crop.name}</h3>
                  <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(crop.status)}`}>
                    <CircleDot className="w-3 h-3" />
                    <span className="text-sm whitespace-nowrap">{getStatusText(crop.status)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Apple className="w-4 h-4" />
                    {crop.type}
                  </p>
                  <p className="text-sm text-green-600">📍 {crop.section}</p>
                  <p className="text-sm text-green-600">🌱 Planted: {crop.planted}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
