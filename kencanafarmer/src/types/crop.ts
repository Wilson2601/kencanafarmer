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
}
