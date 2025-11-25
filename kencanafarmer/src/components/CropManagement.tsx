import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Apple, Trash2, Edit2, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
// select component not used here
import { Crop } from "../types/crop";
import { loadCrops, addCrop, updateCrop, deleteCrop } from "../services/storage";
// harvest prediction handled elsewhere; do not import here

export function CropManagement() {
  const [crops, setCrops] = useState<Crop[]>([]);

  // Add / Edit dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Crop | null>(null);
  const [form, setForm] = useState({ name: "", variety: "", plantingDate: "", location: "", photos: [] as string[] });
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setCrops(loadCrops());
  }, []);

  // (status helpers removed — `Crop` type doesn't include a status field)

  function openAddDialog() {
    setEditing(null);
    setForm({ name: "", variety: "", plantingDate: new Date().toISOString().slice(0,10), location: "", photos: [] });
    setOpen(true);
  }

  function openEditDialog(c: Crop) {
    setEditing(c);
    setForm({
      name: c.name || "",
      variety: c.variety || "",
      plantingDate: c.plantingDate || new Date().toISOString().slice(0,10),
      location: c.location || "",
      photos: c.photos ? [...c.photos] : [],
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;

    if (editing) {
      const updated: Crop = {
        ...editing,
        name: form.name.trim(),
        variety: form.variety || undefined,
        plantingDate: form.plantingDate,
        // preserve existing expectedDaysToHarvest; prediction handled elsewhere
        photos: form.photos && form.photos.length ? form.photos : editing.photos,
        location: form.location || editing.location,
      };
      updateCrop(updated);
      setCrops(loadCrops());
      setEditing(null);
      setOpen(false);
      stopCamera();
      return;
    }

    const newC: Crop = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      variety: form.variety || undefined,
      plantingDate: form.plantingDate,
      photos: form.photos && form.photos.length ? form.photos : [],
      location: form.location || undefined,
    };
    addCrop(newC);
    setCrops(loadCrops());
    setOpen(false);
    stopCamera();
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
    } catch (err) {
    console.error('Failed to open camera', err);
    alert('Unable to access camera. Check browser permissions');
    }
  }

  function stopCamera() {
    setCameraOpen(false);
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  }

  function captureFromCamera() {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setForm({ ...form, photos: [...(form.photos || []), dataUrl] });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this crop?")) return;
    deleteCrop(id);
    setCrops(loadCrops());
  }

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-green-800">My Crops</h1>
          <p className="text-green-600">{crops.length} crops planted</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAddDialog} size="lg" className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 p-0">
            <Plus className="w-6 h-6" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[90%] rounded-lg">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Crop" : "Add New Crop"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Apple Trees"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="variety">Variety / Type</Label>
                  <Input
                    id="variety"
                    placeholder="e.g., Fuji"
                    value={form.variety}
                    onChange={(e) => setForm({ ...form, variety: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="planted">Planting Date</Label>
                  <Input
                    id="planted"
                    type="date"
                    value={form.plantingDate}
                    onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Description)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., North field, row 3, near well"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                {/* photo upload */}
                <div>
                  <Label htmlFor="photos">Photos</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      className="mt-1"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const arr = Array.from(files);
                        const readFileAsDataURL = (file: File) =>
                          new Promise<string>((resolve, reject) => {
                            const fr = new FileReader();
                            fr.onload = () => resolve(String(fr.result));
                            fr.onerror = reject;
                            fr.readAsDataURL(file);
                          });

                        try {
                          const dataUrls = await Promise.all(arr.map(readFileAsDataURL));
                          setForm({ ...form, photos: [...(form.photos || []), ...dataUrls] });
                        } catch (err) {
                          console.error("Failed to read files", err);
                        }

                        // clear input so same file can be chosen again if needed
                        e.currentTarget.value = "";
                      }}
                    />
                    <button type="button" className="ml-2 px-3 py-1 rounded bg-gray-100" onClick={startCamera}>
                      Use Camera
                    </button>
                  </div>

                  {form.photos && form.photos.length ? (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {form.photos.map((p, idx) => (
                        <div key={idx} className="relative border rounded overflow-hidden">
                          <img src={p} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                          <button
                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                            onClick={() => {
                              const copy = [...form.photos];
                              copy.splice(idx, 1);
                              setForm({ ...form, photos: copy });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                {/* Camera preview */}
                {cameraOpen ? (
                  <div className="mt-3">
                    <div className="relative">
                      <video ref={videoRef} className="w-full rounded" playsInline />
                      <div className="flex gap-2 mt-2">
                        <button type="button" className="px-3 py-1 bg-green-600 text-white rounded" onClick={captureFromCamera}>Capture</button>
                        <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={stopCamera}>Close Camera</button>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    {editing ? (
                      <>
                        <Edit2 className="w-5 h-5 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Crop
                      </>
                    )}
                  </Button>
                  <Button onClick={() => { setOpen(false); setEditing(null); }} variant="outline" className="w-32">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Crops List */}
      <div className="space-y-4">
        {crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden bg-white">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={crop.photos && crop.photos.length ? crop.photos[0] : 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60'}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-green-900">{crop.name}</h3>
                  <div className="flex items-center gap-2">
                    {/* prediction UI removed from list; predictions handled by separate flow */}
                    <Button variant="ghost" onClick={() => openEditDialog(crop)} className="p-1">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(crop.id)} className="p-1">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Apple className="w-4 h-4" />
                    {crop.variety || '-'}
                  </p>
                  <p className="text-sm text-green-600">🌱 Planted: {crop.plantingDate}</p>
                  {crop.location ? (
                    <p className="text-sm text-green-600 flex items-center gap-2"><MapPin className="w-4 h-4" />{crop.location}</p>
                  ) : null}
                  {crop.photos && crop.photos.length ? (
                    <p className="text-sm text-green-600">📷 {crop.photos.length} photos</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
