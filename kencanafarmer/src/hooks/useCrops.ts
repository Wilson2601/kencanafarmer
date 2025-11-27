import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Crop } from "../types/crop";

const DEFAULT_CROPS: Crop[] = [];

export function useCrops() {
  const [crops, setCrops] = useLocalStorage<Crop[]>("kencana_crops_v1", DEFAULT_CROPS);

  const addCrop = useCallback((crop: Omit<Crop, "id">) => {
    setCrops((prev) => {
      const newCrop: Crop = {
        ...crop,
        id: crypto.randomUUID(),
      };
      return [...prev, newCrop];
    });
  }, [setCrops]);

  const updateCrop = useCallback((id: string, patch: Partial<Crop>) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, [setCrops]);

  const deleteCrop = useCallback((id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  }, [setCrops]);

  const getCropById = useCallback((id: string) => {
    return crops.find((c) => c.id === id);
  }, [crops]);

  return {
    crops,
    setCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    getCropById,
  } as const;
}
