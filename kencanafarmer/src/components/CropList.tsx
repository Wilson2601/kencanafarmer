import React, { useEffect, useState } from "react";
import { Crop } from "../types/crop";
import { loadCrops, deleteCrop } from "../services/storage";
import { Link } from "react-router-dom";
import { predictHarvestDate } from "../utils/prediction";
import { Button } from "./ui/Button";

export function CropList() {
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    setCrops(loadCrops());
  }, []);

  function remove(id: string) {
    if (!confirm("Delete crop?")) return;
    deleteCrop(id);
    setCrops(loadCrops());
  }

  if (crops.length === 0) {
    return <div className="p-4">No crops yet. Add one from the form.</div>;
  }

  return (
    <div className="space-y-3 p-3">
      {crops.map((c) => (
        <div key={c.id} className="border p-3 rounded flex items-start justify-between">
          <div>
            <Link to={`/crop/${c.id}`} className="text-lg font-semibold text-green-700">
              {c.name}
            </Link>
            <div className="text-sm text-gray-600">
              Planted: {c.plantingDate} • Predicted harvest:{" "}
              {predictHarvestDate(c.plantingDate, c.expectedDaysToHarvest)}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/crop/${c.id}`}>
              <Button variant="ghost">View</Button>
            </Link>
            <Button variant="ghost" onClick={() => remove(c.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
