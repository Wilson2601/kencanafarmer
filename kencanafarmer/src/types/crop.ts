export interface Crop {
  id: string;
  name: string;
  variety?: string;
  plantingDate: string; // ISO date
  expectedDaysToHarvest?: number;
  // free-form human-readable location description (e.g. "North field, row 3, near well")
  location?: string;
  lastWatered?: string;
  lastFertilized?: string;
  lastPesticide?: string;
  photos?: string[]; // base64 data URLs for MVP
  notes?: string;
  // For growth monitoring
  stageIndex?: number; // 0: Planted, 1: Growing, 2: Flowering, 3: Fruiting, 4: Ready
  health?: number; // 0-100
  // For harvest prediction
  expectedYield?: string; // e.g. "850 kg"
  confidenceLevel?: number; // 0-100, confidence of harvest prediction
  estimatedHarvestDate?: string; // ISO date or readable format
}
