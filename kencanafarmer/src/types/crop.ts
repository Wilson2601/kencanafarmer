export interface Crop {
  id: string;
  name: string;
  variety?: string;
  plantingDate: string; // ISO date
  expectedDaysToHarvest?: number;
  lastWatered?: string;
  lastFertilized?: string;
  lastPesticide?: string;
  photos?: string[]; // base64 data URLs for MVP
  notes?: string;
}
