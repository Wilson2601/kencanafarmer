import React from "react";

export function PhotoGallery({ photos }: { photos?: string[] }) {
  if (!photos || photos.length === 0) return <div className="text-sm text-gray-600">No photos yet</div>;
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        // Using img with object-cover; sizes are small for demo
        // In production, use proper optimization/storage
        // eslint-disable-next-line react/no-array-index-key
        <img key={i} src={p} alt={`photo-${i}`} className="w-full h-24 object-cover rounded" />
      ))}
    </div>
  );
}
