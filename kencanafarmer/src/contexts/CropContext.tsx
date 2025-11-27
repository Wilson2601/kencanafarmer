import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the Crop interface
export interface Crop {
  id: number;
  name: string;
  location: string;
  stageIndex: number; // 0: Planted, 1: Growing, etc.
  health: number;
  datePlanted: string;
}

// 2. Define Context type
interface CropContextType {
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id' | 'stageIndex' | 'health'>) => void;
  updateCropStage: (id: number) => void;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

// 3. Crop Provider
export function CropProvider({ children }: { children: ReactNode }) {
  // Initialize from LocalStorage
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem('my_crops');
    // Default dummy data if LocalStorage is empty
    const defaultData: Crop[] = [
        { id: 1, name: 'Apple Tree', location: 'Section A', stageIndex: 2, health: 85, datePlanted: '2023-01-01' }
    ];
    return saved ? JSON.parse(saved) : defaultData;
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('my_crops', JSON.stringify(crops));
  }, [crops]);

  // Add a new crop
  const addCrop = (newCropData: Omit<Crop, 'id' | 'stageIndex' | 'health'>) => {
    const newCrop: Crop = {
      ...newCropData,
      id: Date.now(),
      stageIndex: 0, // Always start at 'Planted'
      health: 100    // Start with full health
    };
    setCrops(prev => [...prev, newCrop]);
  };

  // Simulate stage progression (used in Growth Monitoring)
  const updateCropStage = (id: number) => {
    setCrops(prev => prev.map(crop => {
      if (crop.id === id) {
        return { ...crop, stageIndex: Math.min(crop.stageIndex + 1, 4) };
      }
      return crop;
    }));
  };

  return (
    <CropContext.Provider value={{ crops, addCrop, updateCropStage }}>
      {children}
    </CropContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropContext);
  if (!context) throw new Error('useCrops must be used within a CropProvider');
  return context;
}