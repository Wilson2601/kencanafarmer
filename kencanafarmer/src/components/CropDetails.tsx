import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Crop } from "../types/crop";
import { loadCrops, updateCrop } from "../services/storage";
import { predictHarvestDate } from "../utils/prediction";
import { PhotoGallery } from "./PhotoGallery";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function CropDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const c = loadCrops().find((x) => x.id === id) || null;
    setCrop(c);
    setNote(c?.notes ?? "");
  }, [id]);

  if (!crop) return <div className="p-4">Crop not found</div>;

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      const updated: Crop = { ...crop, photos: [...(crop.photos || []), data] };
      updateCrop(updated);
      setCrop(updated);
    };
    reader.readAsDataURL(f);
  }

  function saveNote() {
    const updated: Crop = { ...crop, notes: note };
    updateCrop(updated);
    setCrop(updated);
    alert("Saved");
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{crop.name}</h2>
        <div>
          <Button onClick={() => navigate(-1)} variant="ghost">
            Back
          </Button>
        </div>
      </div>

      <div className="border p-3 rounded">
        <div>Planted: {crop.plantingDate}</div>
        <div>Predicted harvest: {predictHarvestDate(crop.plantingDate, crop.expectedDaysToHarvest)}</div>
        <div>Expected days: {crop.expectedDaysToHarvest ?? "Unknown"}</div>
      </div>

      <div className="border p-3 rounded">
        <h3 className="font-semibold">Photos</h3>
        <div className="py-2">
          <input type="file" accept="image/*" onChange={onPhoto} />
        </div>
        <PhotoGallery photos={crop.photos} />
      </div>

      <div className="border p-3 rounded">
        <h3 className="font-semibold">Notes</h3>
        <textarea className="w-full border p-2 rounded" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="mt-2">
          <Button onClick={saveNote}>Save Note</Button>
        </div>
      </div>
    </div>
  );
}
