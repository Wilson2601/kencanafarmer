import { Crop } from "../types/crop";

const KEY = "kencana_crops_v1";

export function loadCrops(): Crop[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Crop[]) : [];
  } catch {
    return [];
  }
}

export function saveCrops(crops: Crop[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(crops));
  } catch (e) {
    console.error("Failed to save crops", e);
  }
}

export function addCrop(crop: Crop) {
  const list = loadCrops();
  list.unshift(crop);
  saveCrops(list);
}

export function updateCrop(updated: Crop) {
  const list = loadCrops().map((c) => (c.id === updated.id ? updated : c));
  saveCrops(list);
}

export function deleteCrop(id: string) {
  const list = loadCrops().filter((c) => c.id !== id);
  saveCrops(list);
}
