import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Crop } from "../types/crop";
import { addCrop } from "../services/storage";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

type Props = { onAdded?: (c: Crop) => void };

export function CropForm({ onAdded }: Props) {
  const [name, setName] = useState("");
  const [plantingDate, setPlantingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [expectedDays, setExpectedDays] = useState<number | "">("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("Enter crop name");
    const crop: Crop = {
      id: uuidv4(),
      name: name.trim(),
      plantingDate,
      expectedDaysToHarvest: expectedDays === "" ? undefined : Number(expectedDays),
      photos: [],
    };
    addCrop(crop);
    setName("");
    setExpectedDays("");
    onAdded?.(crop);
  }

  return (
    <form onSubmit={submit} className="space-y-2 p-3 border rounded">
      <div>
        <label className="block text-sm">Crop name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Papaya" />
      </div>
      <div>
        <label className="block text-sm">Planting date</label>
        <Input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Expected days to harvest</label>
        <Input
          type="number"
          min={1}
          value={expectedDays}
          onChange={(e) => setExpectedDays(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="e.g., 90"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Add Crop</Button>
      </div>
    </form>
  );
}
